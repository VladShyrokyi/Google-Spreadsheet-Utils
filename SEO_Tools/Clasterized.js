class aData {
    constructor(sheet) {
        this._sheet = sheet;
        this._range = this._sheet.getDataRange();

        this.numRows = this._range.getNumRows();
        this.numColumns = this._range.getNumColumns();
        
        this._data = this._range.getValues();
        if (Array.isArray(this._data) == false) {
            Logger.log(this._data);
            return `Not Data`;
        }
    }
    Sorting(StartRow) {
        let check_number;
        let row_list = [[]];
        for (let j = StartRow; j <= this.numRows; j++) {
            
            //Работа с первой ячейков в строке
            let current_value = this._data[j - 1][0];
            if ( typeof(current_value) !== 'number') {
                return `column 1 -> need a number group`;
            }
            //Реализация
            if (current_value == check_number) {
                if (Array.isArray(row_list[row_list.length - 1]) == true) 
                row_list[row_list.length - 1].push(j);
            } else {
                let arr = [j];
                row_list.push(arr);
            }
            check_number = current_value;
        }
        for (let i = 1; i < row_list.length; i++) {
            let a = row_list[i];
            let row_start = a[1];
            let row_current = a.length - 1;
            
            let group;
            try {
                group = this._sheet.getRowGroup(row_start, 1);
                group.collapse();
            }
            catch(err) {
                let range_current = this._sheet.getRange(row_start, 1, row_current);
                range_current.shiftRowGroupDepth(1);
                range_current.collapseGroups();
            }
        }
    }
}

function Сlustering() {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getActiveSheet();
    let data =  new aData(sheet);
    data.Sorting(2);
}