"use strict";
class UrlAPI {
    // public get Params(): string[] {
    //   return this._Params ? this._Params : [];
    // }
    // public set Params(value: string[]) {
    //   this._Params = value.map((e) => encodeURIComponent(e));
    // }
    constructor(Base, ReportType, Query, Token, SearchRegion, Params) {
        this.Base = Base;
        this.ReportType = ReportType;
        this.Query = Query;
        this.Token = Token;
        this.SearchRegion = SearchRegion;
        this.Params = Params;
    }
    toString() {
        var _a;
        return (`${encodeURI(this.Base)}` +
            `${encodeURIComponent(this.ReportType)}` +
            `?query=${encodeURIComponent(this.Query)}` +
            `&token=${encodeURIComponent(this.Token)}` +
            `&se=${encodeURIComponent(this.SearchRegion)}` +
            (this.Params != undefined
                ? (_a = this.Params.map((e, i) => i % 2 == 0
                    ? (e = encodeURIComponent(`&${e}`))
                    : (e = encodeURIComponent(`=${e}`)))) === null || _a === void 0 ? void 0 : _a.join(``) : ''));
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
        return e.map((e) => elementPath(e, Path));
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
    map(fn, thisArg) {
        if (typeof this.data == `number` || typeof this.data == `string`)
            return this.data;
        else if (Array.isArray(this.data))
            return this.data.map(fn, thisArg);
        else if (typeof this.data == `object`)
            return Object.values(this.data);
        else
            return null;
    }
}
