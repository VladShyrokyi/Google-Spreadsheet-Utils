function onOpen() {
	let SS: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	let UI: GoogleAppsScript.Base.Ui = SpreadsheetApp.getUi();
	let MENU = new Menu(UI);
}

function TEST() {
	CustomUI.showMessageBox("Hello World", `TEST TEST :)`);
}
