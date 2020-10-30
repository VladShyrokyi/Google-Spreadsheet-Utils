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
function CreateAPI(Base, ReportType, Query, Token, SearchRegion, Params) {
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
function CreateUrl(URL, Query) {
    if (!Query)
        return `No Query`;
    let _Query = encodeURIComponent(Query);
    let q = `?query=`;
    let t = `&token=`;
    let start = URL.indexOf(q);
    let stop = URL.indexOf(t);
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
function FetchToAPI(URL) {
    if (URL == null || URL == `undefined` || URL == `` || URL == `No Query`) {
        return URL;
    }
    let cache = CacheService.getDocumentCache();
    let Key = URL.slice(0, 249);
    if ((cache === null || cache === void 0 ? void 0 : cache.get(Key)) != null ||
        (cache === null || cache === void 0 ? void 0 : cache.get(Key)) != undefined ||
        (cache === null || cache === void 0 ? void 0 : cache.get(Key)) != ``) {
        let content = UrlFetchApp.fetch(URL).getContentText();
        cache === null || cache === void 0 ? void 0 : cache.remove(Key);
        cache === null || cache === void 0 ? void 0 : cache.put(Key, content);
    }
    else if (cache == null) {
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
function GiveFromCache(Key, Path, ...Options) {
    let cache = CacheService.getDocumentCache();
    if (cache == null) {
        return `No cache`;
    }
    let content = cache.get(Key);
    if (content == null) {
        return `-`;
    }
    let data = JSON.parse(content);
    let _Options = {};
    if (Options != null) {
        _Options = new OptionsValid(...Options);
    }
    if (Path != null) {
        let PathArr = Path.split(`/`);
        for (let i = 0; i < PathArr.length; i++) {
            data = ValidateElement(data, PathArr[i]);
        }
    }
    else {
        return `No Path`;
    }
    return CreateOutput(data, _Options);
}
//////////////////////////////////////////
function ValidateElement(e, Path) {
    if (Array.isArray(e)) {
        let arr = [];
        for (let i = 0; i < e.length; i++) {
            let _e = e[i];
            let result = ValidateElement(_e, Path);
            arr.push(result);
        }
        return arr;
    }
    else if (typeof e == `object`) {
        return ValidateObject(e, Path);
    }
    else {
        return e;
    }
}
function ValidateObject(e, Path) {
    for (let property in e) {
        if (property == Path) {
            return e[property];
        }
    }
    return `Element empty`;
}
function CreateOutput(data, Options) {
    if (typeof data == `string`) {
        //Return string
        return data;
    }
    else if (typeof data == `number`) {
        //Return number
        return data;
    }
    else if (Options === null || Options === void 0 ? void 0 : Options[`JSON`]) {
        //Check Options
        return JSON.stringify(data);
    }
    else if (Array.isArray(data)) {
        //Create Result Array
        let DoubleArr = [];
        //Iterating over an array
        data.forEach((Row, y) => {
            if ((Options === null || Options === void 0 ? void 0 : Options[`isCountMax`]) == true && Options[`CountMax`] == y)
                return; //Check options
            if (typeof Row == 'string' || typeof Row == `number`)
                DoubleArr[y] = Row;
            // else if (Options?.[`isRow`] == true) DoubleArr[y] = JSON.stringify(Value);
            else if (Array.isArray(Row))
                Row.forEach((Value, i) => typeof Value == `object`
                    ? DoubleArr.push([JSON.stringify(Value)])
                    : Array.isArray(Value)
                        ? DoubleArr.push([JSON.stringify(Value)])
                        : DoubleArr.push([Value]));
            else
                DoubleArr.push(JSON.stringify(Object.values(Row)));
        });
        //Return result Array
        return DoubleArr;
    }
    else {
        //Return object as string
        return Object.values(data);
    }
}
