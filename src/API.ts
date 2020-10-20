interface IUrl {
  [index: string]: string;
}
/**
 * Create template query to API
 * @param Query Keyword or domain
 * @param Token Token from API
 * @param ReportType Type
 * @param Base
 * @param SearchRegion
 * @param Params Example: "&key=value"
 * @customfunction
 */
function CreateQueryAPI(
  Query: string,
  Token: string,
  ReportType: string,
  Base: string,
  SearchRegion: string,
  Params?: Array<string>
): string {
  let URL: IUrl = { Base, ReportType, Query, Token, SearchRegion };
  for (let key in URL) {
    let component: string = URL[key];
    if (typeof component == `string`) {
      if (component == Base) {
        URL[key] = encodeURI(component);
      } else {
        URL[key] = encodeURIComponent(component);
      }
    }
  }
  let _URL = URL.Base;
  _URL += `${URL.ReportType}`;
  _URL += `?query=${URL.Query}`;
  _URL += `&token=${Token}`;
  _URL += `&se=${SearchRegion}`;
  if (typeof Params == `object` && Params != null) {
    for (let i = 0; i < Params.length; i++) {
      _URL += `&${Params[i]}=${Params[i + 1]}`;
      i++;
    }
  }
  return _URL;
}
/**
 * Create URL from template
 * @param URL Cells URL with "?query="
 * @param Query new value for "?query=value"
 * @customfunction
 */
function CreateUrlFromTemplate(URL: string, Query: string) {
  if (Query == null || Query == `` || Query == `undefined`) {
    return `No Query`;
  }
  let _Query = encodeURIComponent(Query);
  let q = `?query=`;
  let t = `&token=`;
  let start: number = URL.indexOf(q);
  let stop: number = URL.indexOf(t);
  if (start != -1) {
    let query = URL.slice(start + q.length, stop);
    let _URL = URL.replace(query, _Query);
    return _URL;
  }
  return `No Query`;
}
/**
 * Get Data from url. Add it to the cache.
 * @param URL Cells or string with URL
 * @customfunction
 */
function FetchToAPI(URL: string): string {
  if (URL == null || URL == `undefined` || URL == `` || URL == `No Query`) {
    return URL;
  }
  let cache = CacheService.getDocumentCache();
  let Key = URL.slice(0, 249);
  if (
    cache?.get(Key) != null ||
    cache?.get(Key) != undefined ||
    cache?.get(Key) != ``
  ) {
    let content = UrlFetchApp.fetch(URL).getContentText();
    cache?.remove(Key);
    cache?.put(Key, content);
  } else if (cache == null) {
    return `Not cache`;
  }
  return Key;
}
/**
 * Outputting data along a path from the cache.
 * Options: CountMax - maximum rows to output
 * @param Key Cache key entry
 * @param Path String Path/to data/or params
 * @param Options Example: "HideParam", "CountMax = 10", "JSON"
 * @customfunction
 */
function GiveFromCache(Key: string, Path: string, ...Options: string[]) {
  let cache = CacheService.getDocumentCache();
  if (cache == null) {
    return `No cache`;
  }
  let content = cache.get(Key);
  if (content == null) {
    return `-`;
  }
  let data: element = JSON.parse(content);
  let _Options: OptionsValid = {};
  if (Options != null) {
    _Options = new OptionsValid(...Options);
  }
  if (Path != null) {
    let PathArr = Path.split(`/`);
    for (let i = 0; i < PathArr.length; i++) {
      data = ValidateElement(data, PathArr[i]);
    }
  } else {
    return `No Path`;
  }
  return CreateOutput(data, _Options);
}

//Element from JSON//////////////////////
type element = elementArray | elementObj | string | number;
interface elementObj {
  [key: string]: element;
}
interface elementArray extends Array<element> {
  [index: number]: element;
}
//////////////////////////////////////////

function ValidateElement(e: element, Path: string): element {
  if (Array.isArray(e)) {
    let arr: elementArray = [];
    for (let i = 0; i < e.length; i++) {
      let _e = e[i];
      let result = ValidateElement(_e, Path);
      arr.push(result);
    }
    return arr;
  } else if (typeof e == `object`) {
    return ValidateObject(e, Path);
  } else {
    return e;
  }
}
function ValidateObject(e: elementObj, Path: string): element {
  for (let property in e) {
    if (property == Path) {
      return e[property];
    }
  }
  return `Element empty`;
}
function CreateOutput(data: element, Options: OptionsValid) {
  if (typeof data == `string`) {
    //Return string
    return data;
  } else if (typeof data == `number`) {
    //Return number
    return data;
  } else if (Options?.[`JSON`]) {
    //Check Options
    return JSON.stringify(data);
  } else if (Array.isArray(data)) {
    //Create Result Array
    let DoubleArr: Array<Array<string | number> | string | number> = [];

    //Iterating over an array
    data.forEach((Row, y) => {
      if (Options?.[`isCountMax`] == true && Options[`CountMax`] == y) return; //Check options
      if (typeof Row == 'string' || typeof Row == `number`) DoubleArr[y] = Row;
      // else if (Options?.[`isRow`] == true) DoubleArr[y] = JSON.stringify(Value);
      else if (Array.isArray(Row))
        Row.forEach((Value, i) =>
          typeof Value == `object`
            ? DoubleArr.push([JSON.stringify(Value)])
            : Array.isArray(Value)
            ? DoubleArr.push([JSON.stringify(Value)])
            : DoubleArr.push([Value])
        );
      else DoubleArr.push(JSON.stringify(Object.values(Row)));
    });

    //Return result Array
    return DoubleArr;
  } else {
    //Return object as string
    return Object.values(data);
  }
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
interface IUrlAPI extends IUrl {
  Base: string;
  ReportType: string;
  Query: string;
  Token: string;
  SearchRegion: string;
}
class UrlAPI {
  // public get Params(): string[] {
  //   return this._Params ? this._Params : [];
  // }
  // public set Params(value: string[]) {
  //   this._Params = value.map((e) => encodeURIComponent(e));
  // }
  constructor(
    private Base: string,
    public ReportType: string,
    public Query: string,
    public Token: string,
    public SearchRegion: string // public _Params?: string[]
  ) {}
  public toString(): string {
    return (
      `${encodeURI(this.Base)}` +
      `${encodeURIComponent(this.ReportType)}` +
      `?query=${encodeURIComponent(this.Query)}` +
      `&token=${encodeURIComponent(this.Token)}` +
      `&se=${encodeURIComponent(this.SearchRegion)}`
      // +
      // this.Params?.map((e, i) =>
      //   i % 2 == 0
      //     ? (e = encodeURIComponent(`&${e}`))
      //     : (e = encodeURIComponent(`=${e}`))
      // ).join(``)
    );
  }
}
class API {
  private cache = CacheService.getDocumentCache();
  public get UrlAPI(): string {
    return this._UrlAPI.toString();
  }
  constructor(private readonly _UrlAPI: UrlAPI) {}
  FetchQuery(Query: string) {
    Query ? (this._UrlAPI.Query = encodeURIComponent(Query)) : '';
    let Key = this._UrlAPI.toString().slice(0, 249);
    let maybeValue = this.cache?.get(Key);
    if (maybeValue || maybeValue != ``)
      this.cache?.remove(Key) &&
        this.cache.put(
          Key,
          UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText()
        );
    return Key;
  }
  static GiveValue(Key: string, Path: string) {
    let cache = CacheService.getDocumentCache();
    let content = cache?.get(Key);
    if (!content) return `-`;
    let data: element = JSON.parse(content);
    if (Path) Path.split(`/`).forEach((e) => (data = elementPath(data, e)));
    else return `No Path`;
    return data;
  }
}

function elementPath(e: element, Path: string): element {
  if (Array.isArray(e)) return e.map((e, i) => elementPath(e, Path));
  else if (typeof e == `object`) return e[Path] ? e[Path] : `Element empty`;
  else return e;
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

interface IElement {
  _data: element;
  _obj: object;
  _str: string;
  _num: number;
  data: number | string | object | element | undefined;
}

class ElementAPI {
  private _data: element;
  private _obj: object;
  private _str: string;
  private _num: number;
  public get data(): number | string | object | element | undefined {
    return this._num != 0
      ? this._num
      : this._str != ``
      ? this._str
      : this._obj != {}
      ? this._obj
      : this._data != []
      ? this._data
      : undefined;
  }
  constructor(data: element) {
    this._data = [];
    this._str = ``;
    this._num = 0;
    this._obj = {};
    Array.isArray(data)
      ? (this._data = data)
      : typeof data == `object`
      ? (this._obj = data)
      : typeof data == `string`
      ? (this._str = data)
      : typeof data == `number`
      ? (this._num = data)
      : data;
  }
}
