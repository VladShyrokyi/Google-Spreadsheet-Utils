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
    let _URI = new URI(str);
    return new UrlAPI(
      _URI.hostname() + _URI.pathname(),
      _URI.directory(),
      ``,
      ``,
      ``
    );
  }
}
