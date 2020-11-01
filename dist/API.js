"use strict";
//Connected lib URI.js
eval(UrlFetchApp.fetch(`https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.19.2/URI.min.js`).getContentText());
class API {
    constructor(_UrlAPI) {
        this._UrlAPI = _UrlAPI;
        this.cache = CacheService.getDocumentCache();
    }
    get UrlAPI() {
        return this._UrlAPI.valueOf();
    }
    /**
     * Get Data from API. Add to cache.
     * @param Query if has replaced query
     * @returns Key
     */
    FetchQuery(Query) {
        var _a, _b, _c;
        if (!!Query)
            this._UrlAPI.removeSearch(`query`).addSearch({ query: Query });
        let Key = this.UrlAPI.slice(0, 249);
        if (!((_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(Key))) {
            let value = UrlFetchApp.fetch(this._UrlAPI.toString()).getContentText();
            (_b = this.cache) === null || _b === void 0 ? void 0 : _b.remove(Key);
            (_c = this.cache) === null || _c === void 0 ? void 0 : _c.put(Key, value);
        }
        return Key;
    }
}
class DataAPI {
    constructor(key) {
        this.key = key;
        this.options = [];
        this.data = `-`;
        if (!!key) {
            let cache = CacheService.getDocumentCache();
            let content = cache === null || cache === void 0 ? void 0 : cache.get(key);
            this.data = !content ? this.data : JSON.parse(content);
        }
    }
    GetPath(path) {
        path
            ? path.split(`/`).forEach((e) => this.ToPath(e), this)
            : this.setData(`No path`);
        return this;
    }
    /**
     * Add options for write data
     * @param Option `JSON` or `CountMax = ${number}` or `HideParam`
     */
    addOption(Option) {
        this.options.push(Option);
        return this;
    }
    /**
     * Convert data to Double array of string or number
     */
    Write() {
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
    CountMax(count) {
        return this.setData(
        // JSON.stringify(count)
        Array.isArray(this.data)
            ? (this.data.length = count) && this.data
            : this.data);
    }
    /**
     * Convert data to JSON stringify
     * @param {true} is true
     */
    JSON(is) {
        return this.setData(JSON.stringify(this.data));
    }
    ToDoubleArray(data) {
        return data.map((Row, y) => typeof Row == `number` || typeof Row == `string`
            ? Row
            : Array.isArray(Row)
                ? Row.map((Value, x) => typeof Value == `object` || Array.isArray(Value)
                    ? JSON.stringify(Value)
                    : Value)
                : Object.values(Row));
    }
    ToPath(path) {
        if (Array.isArray(this.data))
            return this.setData(this.data.map((e) => new DataAPI().setData(e).ToPath(path).data, this));
        else if (typeof this.data == `object`)
            return this.setData(this.data[path] ? this.data[path] : `-`);
        else
            return this.setData(this.data);
    }
    setData(value) {
        this.data = value;
        return this;
    }
}
