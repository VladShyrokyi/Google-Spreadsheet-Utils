//Element from JSON//////////////////////
type element = string | number; //| { [key: string]: element };
type elementOrObject = element | { [key: string]: element };
type elementOrArray = elementOrObject | elementOrArray[];
type option = [str: string, val: Boolean | number];

interface IData {
  [key: string]: any;
  data: elementOrArray;
  options: option[];
  getPath(path: string): Data;
  addOption(Option: option): Data;
  getData(): elementOrArray;
  setData(value: elementOrArray): Data;
}

class Data {
  [key: string]: any;
  private data: elementOrArray;
  private options: option[] = [];
  constructor(readonly key?: string) {
    this.data = `-`;
    if (!!key) {
      let cache = CacheService.getDocumentCache();
      let content = cache?.get(key);
      this.data = !content ? this.data : JSON.parse(content);
    }
  }
  public getPath(path: string): Data {
    path
      ? path.split(`/`).forEach((e) => this.ToPath(e), this)
      : this.setData(`No path`);
    return this;
  }
  /**
   * Add options for write data
   * @param Option `JSON` or `CountMax = ${number}` or `HideParam`
   */
  public addOption(Option: option): Data {
    this.options.push(Option);
    return this;
  }
  /**
   * Convert data to Double array of string or number
   */
  public getData(): element | Array<element | element[]> {
    if (this.options.length != 0)
      this.options.forEach((e) => this[`${e[0]}`](e[1]), this);
    return typeof this.data == `string` || typeof this.data == `number`
      ? this.data
      : Array.isArray(this.data)
      ? this.ToDoubleArray(this.data)
      : Object.values(this.data);
  }
  public setData(value: elementOrArray): Data {
    this.data = value;
    return this;
  }
  /**
   * Return data[0] or element
   */
  public getHeader(): element | element[] {
    let data = this.getData();
    return !Array.isArray(data) ? data : data[0];
  }
  /**
   * Return element or data[ Start by 0, End or undefined];
   */
  public sliceData(
    Start?: number,
    End?: number
  ): element | Array<element | element[]> {
    let data = this.getData();
    return !Array.isArray(data) ? data : data.slice(Start, End);
  }
  /**
   * Set Max rows to write
   * @param {number} count rows
   */
  public CountMax(count: number): Data {
    return this.setData(
      Array.isArray(this.data)
        ? (this.data.length = count) && this.data
        : this.data
    );
  }
  /**
   * Convert data to JSON stringify
   * @param {true} is true
   */
  public JSON(is: true): Data {
    return this.setData(JSON.stringify(this.data));
  }
  private ToDoubleArray(data: elementOrArray[]): Array<element | element[]> {
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
  private ToPath(path: string): Data {
    if (Array.isArray(this.data))
      return this.setData(
        this.data.map((e) => new Data().setData(e).ToPath(path).data, this)
      );
    else if (typeof this.data == `object`)
      return this.setData(this.data[path] ? this.data[path] : `-`);
    else return this.setData(this.data);
  }
}
