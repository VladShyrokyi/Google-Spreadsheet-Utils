"use strict";
function onOpen() {
    let SS = SpreadsheetApp.getActiveSpreadsheet();
    let UI = SpreadsheetApp.getUi();
    let MENU = new Menu(UI);
}
function TEST() {
    CustomUI.showMessageBox("Hello World", `TEST TEST :)`);
}
