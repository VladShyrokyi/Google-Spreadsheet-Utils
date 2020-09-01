class Menu {
    constructor(UI, menu_Name) {
        this.UI = UI;
        if (typeof(menu_Name) === 'string') {
            this._menu = this.UI.createMenu(menu_Name);
        }
    }
    CreateMenu(_name, _function) {
        this._menu.addItem(_name, _function).addToUi();
    }
}

function showMessageBox(title, message = ``) 
{
  let UI = SpreadsheetApp.getUi();
  let ButtonSet = UI.ButtonSet.OK_CANCEL;
  let responcse = UI.alert(title, message, ButtonSet);
}

function showInputBox(title, message = ``) 
{
  let UI = SpreadsheetApp.getUi();
  let ButtonSet = UI.ButtonSet.OK_CANCEL;
  let responcse = UI.prompt(title, message, ButtonSet);
  let Button = responcse.getSelectedButton();
  if (Button == CANCEL) {
    return Button;
  }
  return responcse.getResponseText();
}

//NOT USE
function DialogHTML( Spreadsheet, Input)
{
  let UI = SpreadsheetApp.getUi();
  let Form = HtmlService.createHtmlOutputFromFile('FormDialog/Dialog')
  .setHeight(200)
  .setWidth(200);
  let Form_Dialog = UI.showDialog(Form);
}
