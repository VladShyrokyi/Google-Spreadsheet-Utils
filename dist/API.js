"use strict";
//Connected lib URI.js
eval(UrlFetchApp.fetch(`https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.2/URI.min.js`).getContentText());
// function bbb(str: string, ...param: string[]) {
//   let url = new URI(str);
//   param.forEach((v, i) => {
//     i % 2 == 0 && url.addQuery(v, param[i + 1]);
//   });
//   return url.href();
// }
class API {
    constructor(_UrlAPI) {
        this._UrlAPI = _UrlAPI;
        this.cache = CacheService.getDocumentCache();
    }
    get UrlAPI() {
        return this._UrlAPI.toString();
    }
    FetchQuery(Query) {
        var _a, _b, _c;
        if (!!Query)
            this._UrlAPI.Query = Query;
        let Key = this.UrlAPI.slice(0, 249);
        if (!((_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(Key))) {
            let value = UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText();
            (_b = this.cache) === null || _b === void 0 ? void 0 : _b.remove(Key);
            (_c = this.cache) === null || _c === void 0 ? void 0 : _c.put(Key, value);
        }
        return Key;
    }
    static GiveValue(Key, Path) {
        let cache = CacheService.getDocumentCache();
        let content = cache === null || cache === void 0 ? void 0 : cache.get(Key);
        if (!content)
            return `-`;
        let data = JSON.parse(content);
        if (Path)
            Path.split(`/`).forEach((e) => (data = API.elementPath(data, e)));
        else
            return `No Path`;
        return data;
    }
    static elementPath(e, Path) {
        if (Array.isArray(e))
            return e.map((e) => API.elementPath(e, Path));
        else if (typeof e == `object`)
            return e[Path] ? e[Path] : `Element empty`;
        else
            return e;
    }
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
