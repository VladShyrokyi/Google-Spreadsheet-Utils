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
        str = encodeURI(str);
        let q = `?query=`;
        let q_start = str.indexOf(q);
        let q_stop = q_start + q.length;
        let t = `&token=`;
        let t_start = str.indexOf(t);
        let t_stop = t_start + t.length;
        let se = `&se=`;
        let se_start = str.indexOf(se);
        let se_stop = se_start + se.length;
        return new UrlAPI(``, ``, ``, ``, ``);
    }
}
