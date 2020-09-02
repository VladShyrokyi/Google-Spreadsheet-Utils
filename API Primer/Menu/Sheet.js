class Sheet {
    constructor (UI, Name = String) {
        let SS = SpreadsheetApp.getActiveSpreadsheet();
        this.sheet = SS.getSheetByName(Name);
    }
    ///Testing Git
    GetDataRange() {
        return this.sheet.getRange()
    }
}