"use strict";
class API {
    constructor(_url) {
        this._url = _url;
        this.cache = CacheService.getDocumentCache();
    }
    get url() {
        return this._url.valueOf();
    }
    /**
     * Get Data from API. Add to cache.
     * @param Query if has replaced query
     * @returns Key
     */
    FetchQuery(Query) {
        var _a, _b, _c;
        if (!!Query)
            this._url.removeSearch(`query`).addSearch({ query: Query });
        let Key = this.url.slice(0, 249);
        if (!((_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(Key))) {
            let value = UrlFetchApp.fetch(this._url.toString()).getContentText();
            (_b = this.cache) === null || _b === void 0 ? void 0 : _b.remove(Key);
            (_c = this.cache) === null || _c === void 0 ? void 0 : _c.put(Key, value);
        }
        return Key;
    }
}
class ApiSerpStat extends API {
    constructor(Base, ReportType, Query, Token, SearchRegion, ...Params) {
        let url = new URI(Base + ReportType)
            .addSearch({ query: Query })
            .addSearch({ token: Token })
            .addSearch({ se: SearchRegion });
        Params.forEach(([key, value]) => url.addSearch(key, value));
        super(url);
    }
}
