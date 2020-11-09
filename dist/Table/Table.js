"use strict";
class Table {
    constructor(range) {
        this._range = range;
        this.sheet = this._range.getSheet();
        this.Rows = this._range.getNumRows();
        this.Columns = this._range.getNumColumns();
        this.data = new Data().setData(this._range.getValues());
    }
    Sorting(StartRow, SortingColumn) {
        var _a;
        let maybeArray = this.data.getData();
        let maybeDoubleArray = Array.isArray(maybeArray) ? maybeArray : [[]];
        let checkArray = maybeDoubleArray.map((e) => (Array.isArray(e) ? e : [e]));
        let checkValue = this._range
            .getCell(StartRow, SortingColumn)
            .getValue();
        let Arr = [];
        for (let i = StartRow; i <= this.Rows; i++) {
            let Value = checkArray[i - 1][SortingColumn];
            if (Value == checkValue)
                Array.isArray(Arr[Arr.length - 1])
                    ? Arr[Arr.length - 1].push(i)
                    : Arr[0].push(i);
            else
                Arr.push([i]);
            checkValue = Value;
        }
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
        return this;
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
        return this;
    }
}
class ActiveTable extends Table {
    constructor(sheet) {
        super(sheet.getActiveRange() || sheet.getRange(1, 1));
        this.sheet = sheet;
    }
}
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
class MarkingTable extends TemplateTable {
    constructor(sheet) {
        super({ sheet, RowStart: 1, ColumnStart: 1, height: 5, width: 2 });
        this._base = `http://api.serpstat.com/v3/`;
        this._reportType = [`domain_keywords`, `keywords`];
        this._query = [[], []];
        this._token = `84a70800e984ef048ae0e352d2e093ed`;
        this._searchRegion = `g_ua`;
        let domain = `Domain`;
        let keywords = `Keywords`;
        this.getHeader().find((headerName, index) => (headerName == domain &&
            this.getValues().forEach((r) => this._query[0].push(r[index]))) ||
            (headerName == keywords &&
                this.getValues().forEach((r) => this._query[1].push(r[index]))));
        this.Keys = [];
    }
    FetchToAPI() {
        let URLs = [];
        this._query.forEach((e, i) => e.forEach((q) => URLs.push(new API(new URI(CreateAPI(this._base, this._reportType[i], q.toString(), this._token, this._searchRegion))))));
        this.Keys = URLs.map((str) => str.FetchQuery());
        return this;
    }
    GiveValuesFromAPI() {
        let result = `result/hits`;
        let resultArr = [];
        this.Keys.forEach((e) => {
            let Data = GiveFromCache(e, result);
            Array.isArray(Data)
                ? Data.forEach((Row) => resultArr.push(Array.isArray(Row)
                    ? Row //.map((Value) => Value)
                    : [Row]))
                : resultArr.push([Data]);
        });
        return resultArr;
    }
}
function MarkingQuery() {
    let sheet = SpreadsheetApp.getActiveSheet();
    let template = new MarkingTable(sheet);
    let Values = template.FetchToAPI().GiveValuesFromAPI();
    let lengthMax = Values.reduce((max, e, i, arr) => (max > e.length ? max : e.length), 0);
    let CorrectedValues = Values.map((arr) => {
        arr.length = lengthMax;
        return arr;
    });
    let range = sheet.getRange(1, 3, CorrectedValues.length, lengthMax);
    range.setValues(Values);
}
