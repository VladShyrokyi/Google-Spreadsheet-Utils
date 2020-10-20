"use strict";
class Data {
    constructor(range) {
        this._range = range;
        this.Rows = this._range.getNumRows();
        this.Columns = this._range.getNumColumns();
        range;
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
    // directed 1 - column+: 0 - row+
    Copy(directed = 0) {
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
    // _header: Array<string | number>;
    constructor(sheet, RowStart, ColumnStart, height, width) {
        super(sheet.getRange(RowStart, ColumnStart, height, width));
        this.sheet = sheet;
        this.header = sheet.getRange(RowStart, width).getValues()[0];
    }
    set header(Values) {
        if (Array.isArray(Values))
            this.header = Values;
        else {
            this.header = [];
            this.header[0] = Values;
        }
    }
    get header() {
        return this.header;
    }
}
function MarkingQuery() {
    let _token = `84a70800e984ef048ae0e352d2e093ed`;
    let _reportType = ``;
    let _base = ``;
    let _searchRegion = ``;
    let _result = `result`;
    let _domain = `Domain`;
    let _keywords = `Keywords`;
    let sheet = SpreadsheetApp.getActiveSheet();
    let template = new TemplateData(sheet, 1, 1, 5, 2);
    let query = [];
    template.header.find((v, i) => {
        if (v == _domain && v == _keywords) {
            template.data.forEach((y) => query.push(y[i]));
        }
    });
    let URL = query.map((e) => CreateQueryAPI(e, _token, _reportType, _base, _searchRegion));
    let Keys = URL.map((e) => FetchToAPI(e));
    let Values = [];
    let x = Values[0];
    Keys.forEach((e, i) => {
        let val = GiveFromCache(e, _result);
        Array.isArray(val) ? (Values[i] = val) : (Values[i][0] = val);
    });
    let range = sheet.getRange(1, 3, 5, 2);
    range.setValues(Values);
}
// class MarkingQuery {
// 	constructor(template: TemplateData) {
// 	}
// }
