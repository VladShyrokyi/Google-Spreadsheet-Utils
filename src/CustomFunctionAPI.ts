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
  ...Params: string[]
): string {
  let URL = new URI(Base + ReportType)
    .addSearch({ query: Query })
    .addSearch({ token: Token })
    .addSearch({ se: SearchRegion });
  Params.forEach(([key, value]) => URL.addSearch(key, value));
  return URL.valueOf();
}
/**
 * Fetch URL from API. If there is a query, a new URL will be created.
 * Push the response to the cache. Returns the key for a value from the cache
 * @param {string} URL Cells with URL
 * @param {string} Query new value for "?query=value"
 * @returns {string} if no url return `No URL` else return Key of Cache
 * @customfunction
 */
function FetchUrlToAPI(URL: string, Query?: string): string {
  let _URL = new URI(URL);
  let _API = new API(_URL);
  return !_URL.is('url')
    ? `No URL`
    : !Query
    ? _API.FetchQuery()
    : _API.FetchQuery(Query);
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
  let data: element = API.GiveValue(Key, Path);
  // let _Options: OptionsValid = {};
  // if (Options != null) {
  //   _Options = new OptionsValid(...Options);
  // }
  // return CreateOutput(data, _Options);
  return writeValue(data, Options[0]);
}

// function CreateOutput(data: element, Options: OptionsValid) {
//   if (typeof data == `string`) {
//     //Return string
//     return data;
//   } else if (typeof data == `number`) {
//     //Return number
//     return data;
//   } else if (Options?.[`JSON`]) {
//     //Check Options
//     return JSON.stringify(data);
//   } else if (Array.isArray(data)) {
//     //Create Result Array
//     let DoubleArr: Array<Array<string | number> | string | number> = [];

//     //Iterating over an array
//     data.forEach((Row, y) => {
//       if (Options?.[`isCountMax`] == true && Options[`CountMax`] == y) return; //Check options
//       if (typeof Row == 'string' || typeof Row == `number`) DoubleArr[y] = Row;
//       // else if (Options?.[`isRow`] == true) DoubleArr[y] = JSON.stringify(Value);
//       else if (Array.isArray(Row))
//         Row.forEach((Value, i) =>
//           typeof Value == `object`
//             ? DoubleArr.push([JSON.stringify(Value)])
//             : Array.isArray(Value)
//             ? DoubleArr.push([JSON.stringify(Value)])
//             : DoubleArr.push([Value])
//         );
//       else DoubleArr.push(JSON.stringify(Object.values(Row)));
//     });

//     //Return result Array
//     return DoubleArr;
//   } else {
//     //Return object as string
//     return Object.values(data);
//   }
// }
