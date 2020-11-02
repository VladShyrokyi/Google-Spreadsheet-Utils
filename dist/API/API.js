"use strict";
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
