/**
 * Create template query to API SerpStat
 * @param {string} Base URL API Example: "http://api.serpstat.com/v3/"
 * @param {string} ReportType Type
 * @param {string} Query Keyword or domain
 * @param {string} Token Token from API
 * @param {string} SearchRegion
 * @param {string} Params Example: "&key=value"
 * @returns {string}
 * @customfunction
 */
function CreateAPI(
  Base: string,
  ReportType: string,
  Query: string,
  Token: string,
  SearchRegion: string,
  Params?: Array<string>
): string {
  let URL = new UrlAPI(Base, ReportType, Query, Token, SearchRegion);

  if (typeof Params == `object` && !!Params)
    for (let i = 0; i < Params.length; i++)
      URL.addParams(Params[i], Params[i + 1]) && i++;

  return URL.toString();
}
/**
 * Create URL from template
 * @param URL Cells URL with "?query="
 * @param Query new value for "?query=value"
 * @customfunction
 */
function CreateUrl(URL: string, Query: string) {
  if (!Query) return `No Query`;

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
