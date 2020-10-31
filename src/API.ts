//Connected lib URI.js
eval(
  UrlFetchApp.fetch(
    `https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.2/URI.min.js`
  ).getContentText()
);

//Element from JSON//////////////////////
type element = element[] | { [key: string]: element } | string | number;

class API {
  private cache = CacheService.getDocumentCache();
  public get UrlAPI(): string {
    return this._UrlAPI.valueOf();
  }
  constructor(private readonly _UrlAPI: URI) {}
  /**
   * Get Data from API. Add to cache.
   * @param Query if has replaced query
   */
  FetchQuery(Query?: string): string {
    if (!!Query) this._UrlAPI.removeSearch(`query`).addSearch({ query: Query });
    let Key = this.UrlAPI.slice(0, 249);
    if (!this.cache?.get(Key)) {
      let value = UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText();
      this.cache?.remove(Key);
      this.cache?.put(Key, value);
    }
    return Key;
  }
  /**
   * Give Value to path from json object
   * @param Key Key for value from cache
   * @param Path Path to JSON object
   */
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
function writeValue(data: element, Options: string): element {
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

// interface IOptions {
//   [key: string]: Boolean | number;
// }
// class OptionsValid {
//   options: IOptions[];
//   data: element;
//   constructor(data: element, ...Options: string[]) {
//     this.data = data;
//     this.options = Object.fromEntries(
//       new Map(
//         Options.map(
//           (e: string, i) => (e.includes(` = `)
//             ? [`${e.split(` = `)[0]}`, parseInt(e[1]) - 1]
//             : [`${e}`]
//           )
//         )
//       )
//     );
//   }
//   JSON() {
//     return this[`JSON`]
//       ?  JSON.stringify(this.)
//   }
//   Validate(data: element) {
//     return this[`JSON`]
//       ? JSON.stringify(data) :
//       this[`isCount`] && this[`CountMax`]
//         ?
//   }
// }
