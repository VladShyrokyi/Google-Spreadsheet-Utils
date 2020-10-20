"use strict";
class Menu {
    constructor(UI) {
        this.UI = UI;
        UI.createMenu(`GLOBAL`)
            .addSubMenu(UI.createMenu(`SerpStat API`)
            .addItem('Start', `TEST`)
            .addItem(`Refresh`, `RefreshCellFormula`)
            .addItem(`Sorting by groups`, `Grouping`)
            .addItem(`Move active range`, `CopyData`))
            .addSubMenu(UI.createMenu(`GSC`)
            .addItem(`Authentication`, `TEST`)
            .addItem(`Reset OAuth`, `TEST`)
            .addItem(`Get Sites (To Active Range)`, `TESTGSC`)
            .addItem(`Sitemap Get`, `TEST`)
            .addItem(`Sitemap Set`, `TEST`)
            .addItem(`Sitemap Delete`, `TEST`)
            .addItem(`Active Range Sitemap Set`, `TEST`))
            .addSubMenu(UI.createMenu(`Properties`).addItem(`Get properties`, `GetProperties`))
            .addSubMenu(UI.createMenu(`Templates`).addItem(`Base`, `MarkingQuery`))
            .addToUi();
    }
}
class CustomUI {
    static showMessageBox(title, message = '') {
        let UI = SpreadsheetApp.getUi();
        UI.alert(title, message, UI.ButtonSet.OK);
    }
    static showInputBox(title, message = '') {
        let UI = SpreadsheetApp.getUi();
        let ButtonSet = UI.ButtonSet.OK_CANCEL;
        let response = UI.prompt(title, message, ButtonSet);
        let resButton = response.getSelectedButton();
        if (resButton != UI.Button.OK) {
            return resButton;
        }
        return response.getResponseText();
    }
}
CustomUI.CANCEL = () => SpreadsheetApp.getUi().Button.CANCEL ||
    SpreadsheetApp.getUi().Button.CLOSE ||
    SpreadsheetApp.getUi().Button.NO;
CustomUI.OK = () => SpreadsheetApp.getUi().Button.OK || SpreadsheetApp.getUi().Button.YES;
function TESTGSC() {
    let urls = GSC.getSites();
    if (urls != null) {
        CustomUI.showMessageBox(`URLs`, urls.map((e) => `Site: ${JSON.stringify(e, null, ` \r\n`)}`).join(`\r\n`));
    }
}
