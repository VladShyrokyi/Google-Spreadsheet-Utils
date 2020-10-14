//For DataStructure
class Sheet {
    constructor (UI, Name = String) {
        let SS = SpreadsheetApp.getActiveSpreadsheet();
        this.sheet = SS.getSheetByName(Name);
    }
    
    GetDataRange() {
        return this.sheet.getRange()
    }
}