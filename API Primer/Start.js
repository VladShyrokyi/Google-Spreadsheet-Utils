function onOpen() {
  let SS = SpreadsheetApp.getActive();
  let UI = SpreadsheetApp.getUi();
  let Menu_SERP = new MenuSERP(UI, 'API Serpstat');
  let Menu_GSC = new MenuGSC(UI, `GSC`);
}

function onEdit(e) {
  
}