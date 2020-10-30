"use strict";
class Data {
    constructor(range) {
        this._range = range;
        this.Rows = this._range.getNumRows();
        this.Columns = this._range.getNumColumns();
        this.data = this._range.getValues();
        this.sheet = this._range.getSheet();
    }
    Sorting(StartRow, SortingColumn) {
        var _a;
        let checkValue = this._range
            .getCell(StartRow, SortingColumn)
            .getValue();
        let Arr = [];
        for (let i = StartRow; i <= this.Rows; i++) {
            let Value = this.data[i - 1][SortingColumn];
            if (Value == checkValue) {
                Array.isArray(Arr[Arr.length - 1])
                    ? Arr[Arr.length - 1].push(i)
                    : Arr[0].push(i);
            }
            else {
                Arr.push([i]);
            }
            checkValue = Value;
        }
        // return CustomUI.showMessageBox(`Array`, JSON.stringify(Arr));
        for (let i = 0; i < Arr.length; i++) {
            let Group = Arr[i];
            let Start = Group[1];
            let End = Group.length - 1;
            if (Start == null)
                Start = Group[0] + 1;
            if (End == 0)
                End = 1;
            try {
                (_a = this.sheet.getRowGroup(Start, 1)) === null || _a === void 0 ? void 0 : _a.collapse(); //if Group has been
            }
            catch (error) {
                this.sheet
                    .getRange(Start, SortingColumn, End)
                    .shiftRowGroupDepth(1)
                    .collapseGroups();
            }
        }
    }
    //** directed 1 - column +: 0 - row + * /
    CopyOffset(directed = 0) {
        let rangeNew;
        if (directed == 1)
            rangeNew = this._range.offset(0, this.Columns);
        else if (directed == 0)
            rangeNew = this._range.offset(this.Rows, 0);
        else
            rangeNew = this._range;
        this._range.copyTo(rangeNew);
    }
}
class ActiveDate extends Data {
    constructor(sheet) {
        super(sheet.getActiveRange() || sheet.getRange(1, 1));
        this.sheet = sheet;
    }
}
class TemplateData extends Data {
    constructor(sheet, RowStart, ColumnStart, height, width) {
        super(sheet.getRange(RowStart, ColumnStart, height, width));
        this.sheet = sheet;
        this._header = [];
        this.header = this.data[0];
        this._values = [];
        height > 1 ? (this.values = this.data.slice(1)) : {};
    }
    set header(Values) {
        Array.isArray(Values)
            ? (this._header = Values)
            : typeof Values == `object`
                ? (this._header = Object.values(Values))
                : (this._header = []) && (this._header[0] = Values);
    }
    get header() {
        return this._header;
    }
    get values() {
        return this._values;
    }
    set values(value) {
        this._values = value.map((e) => Array.isArray(e) ? e : typeof e == `object` ? Object.values(e) : [e]);
    }
}
class MarkingData extends TemplateData {
    constructor(sheet) {
        super(sheet, 1, 1, 5, 2);
    }
}
function MarkingQuery() {
    let _token = `84a70800e984ef048ae0e352d2e093ed`;
    let _reportType = [`keyword_info`, `domain_info`];
    let _base = `http://api.serpstat.com/v3/`;
    let _searchRegion = `g_ua`;
    let _result = `result`;
    let _domain = `Domain`;
    let _keywords = `Keywords`;
    let sheet = SpreadsheetApp.getActiveSheet();
    let template = new TemplateData(sheet, 1, 1, 5, 2);
    let query = [[], []];
    template.header.find((v, i) => {
        if (v == _domain)
            template.data.forEach((y, index) => index != 0 ? query[0].push(y[i]) : '');
        else if (v == _keywords)
            template.data.forEach((y, index) => index != 0 ? query[1].push(y[i]) : ``);
    });
    let URLs = query.map((e, i) => e.map((q) => CreateAPI(q, _token, _reportType[i], _base, _searchRegion)));
    let Keys = URLs.map((e) => e.map((q) => FetchToAPI(q)));
    let Values = [];
    Keys.forEach((e, y) => {
        e.forEach((v, x) => {
            let val = GiveFromCache(v, _result);
            Array.isArray(val)
                ? Values.push(val)
                : typeof Values.push([val]) == `object`
                    ? Values.push(Object.values(val))
                    : Values.push([val]);
        });
    });
    CustomUI.showMessageBox(`TEST`, JSON.stringify(Values));
    let range = sheet.getRange(1, 3, Values.length, Values.reduce((maxI, e, i, arr) => (arr[maxI].length > e.length ? maxI : i), 0));
    range.setValues([
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
    ]);
    CustomUI.showMessageBox(`TEST`, JSON.stringify(range.getA1Notation()));
    range.setValues(Values);
}
