"use strict";
class Data {
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
    getPath(path) {
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
    getData() {
        if (this.options.length != 0)
            this.options.forEach((e) => this[`${e[0]}`](e[1]), this);
        return typeof this.data == `string` || typeof this.data == `number`
            ? this.data
            : Array.isArray(this.data)
                ? this.ToDoubleArray(this.data)
                : Object.values(this.data);
    }
    setData(value) {
        this.data = value;
        return this;
    }
    /**
     * Return data[0] or element
     */
    getHeader() {
        let data = this.getData();
        return !Array.isArray(data) ? data : data[0];
    }
    /**
     * Return element or data[ Start by 0, End or undefined];
     */
    sliceData(Start, End) {
        let data = this.getData();
        return !Array.isArray(data) ? data : data.slice(Start, End);
    }
    /**
     * Set Max rows to write
     * @param {number} count rows
     */
    CountMax(count) {
        return this.setData(Array.isArray(this.data)
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
            return this.setData(this.data.map((e) => new Data().setData(e).ToPath(path).data, this));
        else if (typeof this.data == `object`)
            return this.setData(this.data[path] ? this.data[path] : `-`);
        else
            return this.setData(this.data);
    }
}
