interface IUrlAPI {
  Base: string;
  ReportType: string;
  Query: string;
  Token: string;
  SearchRegion: string;
  toString(): string;
}
class UrlAPI implements IUrlAPI {
  constructor(
    public Base: string,
    public ReportType: string,
    public Query: string,
    public Token: string,
    public SearchRegion: string,
    private Params?: string[]
  ) {}
  public addParams(key: string, value: string): string {
    this.Params?.push(key, value);
    return key;
  }
  public deleteParams(key: string): string {
    this.Params?.find((e, i) => e == key && this.Params?.splice(i, 2));
    return key;
  }
  public toString(): string {
    return (
      `${encodeURI(this.Base)}` +
      `${encodeURIComponent(this.ReportType)}` +
      `?query=${encodeURIComponent(this.Query)}` +
      `&token=${encodeURIComponent(this.Token)}` +
      `&se=${encodeURIComponent(this.SearchRegion)}` +
      (this.Params != undefined &&
        this.Params.map((e, i) =>
          i % 2 == 0
            ? (e = encodeURIComponent(`&${e}`))
            : (e = encodeURIComponent(`=${e}`))
        )?.join(``))
    );
  }
  public static ConvertUrlStringToUrlAPI(str: string): UrlAPI {
    str = encodeURI(str);

    let q = `?query=`;
    let q_start = str.indexOf(q);
    let q_stop = q_start + q.length;

    let t = `&token=`;
    let t_start = str.indexOf(t);
    let t_stop = t_start + t.length;

    let se = `&se=`;
    let se_start = str.indexOf(se);
    let se_stop = se_start + se.length;

    return new UrlAPI(``, ``, ``, ``, ``);
  }
}
