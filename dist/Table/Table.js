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
