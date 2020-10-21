class API {
  private cache = CacheService.getDocumentCache();
  public get UrlAPI(): string {
    return this._UrlAPI.toString();
  }
  constructor(private readonly _UrlAPI: UrlAPI) {}
  FetchQuery(Query?: string): string {
    if (!!Query) this._UrlAPI.Query = Query;
    let Key = this.UrlAPI.slice(0, 249);
    if (!this.cache?.get(Key)) {
      let value = UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText();
      this.cache?.remove(Key);
      this.cache?.put(Key, value);
    }
    return Key;
  }
  static GiveValue(Key: string, Path: string): element {
    let cache = CacheService.getDocumentCache();
    let content = cache?.get(Key);
    if (!content) return `-`;
    let data: element = JSON.parse(content);
    if (Path) Path.split(`/`).forEach((e) => (data = API.elementPath(data, e)));
    else return `No Path`;
    return data;
  }
  private static elementPath(e: element, Path: string): element {
    if (Array.isArray(e)) return e.map((e) => API.elementPath(e, Path));
    else if (typeof e == `object`) return e[Path] ? e[Path] : `Element empty`;
    else return e;
  }
}
function writeValue(data: element, Options: string) {
  return typeof data == `string` || typeof data == `number`
    ? data
    : Array.isArray(data)
    ? toDoubleArray(data, Options)
    : Object.values(data);
}
function toDoubleArray(Arr: Array<element>, Options: string) {
  return Arr.map((Row, y) =>
    typeof Row == `number` || typeof Row == `string`
      ? Row
      : Array.isArray(Row)
      ? Row.map((Value, x) =>
          typeof Value == `object` || Array.isArray(Value)
            ? JSON.stringify(Value)
            : Value
        )
      : JSON.stringify(Object.values(Row))
  );
}

interface IOptions {
  [key: string]: Boolean | number;
}
class OptionsValid implements IOptions {
  [key: string]: number | Boolean;
  constructor(...Options: string[]) {
    Options.find((e: string) => {
      let arr = [];
      if (e.includes(` = `)) {
        arr = e.split(` = `);
        this[`is${arr[0]}`] = true;
        this[arr[0]] = parseInt(e[1]) - 1;
      } else {
        this[`is${e}`] = true;
      }
    }, this);
  }
}
