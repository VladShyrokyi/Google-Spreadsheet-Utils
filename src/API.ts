//Connected lib URI.js
eval(
  UrlFetchApp.fetch(
    `https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.2/URI.min.js`
  ).getContentText()
);

class API {
  private cache = CacheService.getDocumentCache();
  public get UrlAPI(): string {
    return this._UrlAPI.valueOf();
  }
  constructor(private readonly _UrlAPI: URI) {}
  /**
   * Get Data from API. Add to cache.
   * @param Query if has replaced query
   * @returns Key
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
}

//Element from JSON//////////////////////
type element = element[] | { [key: string]: element } | string | number;
type option = [str: string, val: Boolean | number];
class DataAPI {
  [key: string]: any;
  public data: element;
  public options: option[] = [];
  constructor(readonly key?: string) {
    this.data = `-`;
    if (!!key) {
      let cache = CacheService.getDocumentCache();
      let content = cache?.get(key);
      this.data = !content ? this.data : JSON.parse(content);
    }
  }
  public GetPath(path: string): DataAPI {
    path
      ? path.split(`/`).forEach((e) => this.ToPath(e), this)
      : this.setData(`No path`);
    return this;
  }
  /**
   * Add options for write data
   * @param Option `JSON` or `CountMax = ${number}` or `HideParam`
   */
  public addOption(Option: option): DataAPI {
    this.options.push(Option);
    return this;
  }
  /**
   * Convert data to Double array of string or number
   */
  public Write() {
    if (this.options.length != 0)
      this.options.forEach((e) => this[`${e[0]}`](e[1]), this);
    return typeof this.data == `string` || typeof this.data == `number`
      ? this.data
      : Array.isArray(this.data)
      ? this.ToDoubleArray(this.data)
      : Object.values(this.data);
  }
  /**
   * Set Max rows to write
   * @param {number} count rows
   */
  public CountMax(count: number): DataAPI {
    return this.setData(
      // JSON.stringify(count)
      Array.isArray(this.data)
        ? (this.data.length = count) && this.data
        : this.data
    );
  }
  /**
   * Convert data to JSON stringify
   * @param {true} is true
   */
  public JSON(is: true): DataAPI {
    return this.setData(JSON.stringify(this.data));
  }
  private ToDoubleArray(data: element[]): element {
    return data.map((Row, y) =>
      typeof Row == `number` || typeof Row == `string`
        ? Row
        : Array.isArray(Row)
        ? Row.map((Value, x) =>
            typeof Value == `object` || Array.isArray(Value)
              ? JSON.stringify(Value)
              : Value
          )
        : Object.values(Row)
    );
  }
  private ToPath(path: string): DataAPI {
    if (Array.isArray(this.data))
      return this.setData(
        this.data.map((e) => new DataAPI().setData(e).ToPath(path).data, this)
      );
    else if (typeof this.data == `object`)
      return this.setData(this.data[path] ? this.data[path] : `-`);
    else return this.setData(this.data);
  }
  private setData(value: element): DataAPI {
    this.data = value;
    return this;
  }
}
