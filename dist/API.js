"use strict";
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
function CreateQueryAPI(Query, Token, ReportType, Base, SearchRegion, Params) {
    let URL = { Base, ReportType, Query, Token, SearchRegion };
    for (let key in URL) {
        let component = URL[key];
        if (typeof component == `string`) {
            if (component == Base) {
                URL[key] = encodeURI(component);
            }
            else {
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
function CreateUrlFromTemplate(URL, Query) {
    if (Query == null || Query == `` || Query == `undefined`) {
        return `No Query`;
    }
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
class OptionsValid {
    constructor(...Options) {
        Options.find((e) => {
            let arr = [];
            if (e.includes(` = `)) {
                arr = e.split(` = `);
                this[`is${arr[0]}`] = true;
                this[arr[0]] = parseInt(e[1]) - 1;
            }
            else {
                this[`is${e}`] = true;
            }
        }, this);
    }
}
class UrlAPI {
    // public get Params(): string[] {
    //   return this._Params ? this._Params : [];
    // }
    // public set Params(value: string[]) {
    //   this._Params = value.map((e) => encodeURIComponent(e));
    // }
    constructor(Base, ReportType, Query, Token, SearchRegion // public _Params?: string[]
    ) {
        this.Base = Base;
        this.ReportType = ReportType;
        this.Query = Query;
        this.Token = Token;
        this.SearchRegion = SearchRegion;
    }
    toString() {
        return (`${encodeURI(this.Base)}` +
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
    constructor(_UrlAPI) {
        this._UrlAPI = _UrlAPI;
        this.cache = CacheService.getDocumentCache();
    }
    get UrlAPI() {
        return this._UrlAPI.toString();
    }
    FetchQuery(Query) {
        var _a, _b;
        Query ? (this._UrlAPI.Query = encodeURIComponent(Query)) : '';
        let Key = this._UrlAPI.toString().slice(0, 249);
        let maybeValue = (_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(Key);
        if (maybeValue || maybeValue != ``)
            ((_b = this.cache) === null || _b === void 0 ? void 0 : _b.remove(Key)) &&
                this.cache.put(Key, UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText());
        return Key;
    }
    static GiveValue(Key, Path) {
        let cache = CacheService.getDocumentCache();
        let content = cache === null || cache === void 0 ? void 0 : cache.get(Key);
        if (!content)
            return `-`;
        let data = JSON.parse(content);
        if (Path)
            Path.split(`/`).forEach((e) => (data = elementPath(data, e)));
        else
            return `No Path`;
        return data;
    }
}
function elementPath(e, Path) {
    if (Array.isArray(e))
        return e.map((e, i) => elementPath(e, Path));
    else if (typeof e == `object`)
        return e[Path] ? e[Path] : `Element empty`;
    else
        return e;
}
function writeValue(data, Options) {
    return typeof data == `string` || typeof data == `number`
        ? data
        : Array.isArray(data)
            ? toDoubleArray(data, Options)
            : Object.values(data);
}
function toDoubleArray(Arr, Options) {
    return Arr.map((Row, y) => typeof Row == `number` || typeof Row == `string`
        ? Row
        : Array.isArray(Row)
            ? Row.map((Value, x) => typeof Value == `object` || Array.isArray(Value)
                ? JSON.stringify(Value)
                : Value)
            : JSON.stringify(Object.values(Row)));
}
class ElementAPI {
    constructor(data) {
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
    get data() {
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
}
