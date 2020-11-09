"use strict";
class TemplateTable extends Table {
    constructor(Options) {
        super(Options.sheet.getRange(Options.RowStart, Options.ColumnStart, Options.height, Options.width));
        this._header = [];
        this._values = [];
        this.header = this.data.getHeader();
        if (Options.height > 1)
            this.values = this.data.sliceData(1);
    }
    getHeader() {
        return this._header;
    }
    set header(value) {
        this._header = Array.isArray(value) ? value : [value];
    }
    getValues() {
        return this._values;
    }
    set values(value) {
        this._values = Array.isArray(value)
            ? value.map((r) => (Array.isArray(r) ? r : [r]))
            : [[value]];
    }
}
