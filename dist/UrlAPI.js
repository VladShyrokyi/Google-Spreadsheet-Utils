"use strict";
class UrlAPI {
    constructor(Base, ReportType, Query, Token, SearchRegion, Params) {
        this.Base = Base;
        this.ReportType = ReportType;
        this.Query = Query;
        this.Token = Token;
        this.SearchRegion = SearchRegion;
        this.Params = Params;
    }
    addParams(key, value) {
        var _a;
        (_a = this.Params) === null || _a === void 0 ? void 0 : _a.push(key, value);
        return key;
    }
    deleteParams(key) {
        var _a;
        (_a = this.Params) === null || _a === void 0 ? void 0 : _a.find((e, i) => { var _a; return e == key && ((_a = this.Params) === null || _a === void 0 ? void 0 : _a.splice(i, 2)); });
        return key;
    }
    toString() {
        var _a;
        return (`${encodeURI(this.Base)}` +
            `${encodeURIComponent(this.ReportType)}` +
            `?query=${encodeURIComponent(this.Query)}` +
            `&token=${encodeURIComponent(this.Token)}` +
            `&se=${encodeURIComponent(this.SearchRegion)}` +
            (this.Params != undefined && ((_a = this.Params.map((e, i) => i % 2 == 0
                ? (e = encodeURIComponent(`&${e}`))
                : (e = encodeURIComponent(`=${e}`)))) === null || _a === void 0 ? void 0 : _a.join(``))));
    }
    static ConvertUrlStringToUrlAPI(str) {
        let _URI = new URI(str);
        return new UrlAPI(_URI.hostname() + _URI.pathname(), _URI.directory(), ``, ``, ``);
    }
}
