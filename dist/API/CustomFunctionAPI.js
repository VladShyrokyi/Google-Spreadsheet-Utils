"use strict";
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
function CreateAPI(Base, ReportType, Query, Token, SearchRegion, ...Params) {
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
function FetchUrlToAPI(URL, Query) {
    let _URL = new URI(URL);
    let _API = new API(_URL);
    return !_URL.is('url') ? `No URL` : !Query ? `-` : _API.FetchQuery(Query);
}
/**
 * Outputting data along a path from the cache.
 * Options: CountMax - maximum rows to output
 * @param Key Cache key entry
 * @param Path String Path/to data/or params
 * @param Options Example: "HideParam", "CountMax = 10", "JSON"
 * @customfunction
 */
function GiveFromCache(Key, Path, ...Options) {
    let data = new Data(Key).getPath(Path);
    Options.forEach((e) => e.includes(` = `)
        ? data.addOption([`${e.split(` = `)[0]}`, parseInt(e.split(` = `)[1])])
        : data.addOption([`${e}`, true]));
    return data.getData();
}
