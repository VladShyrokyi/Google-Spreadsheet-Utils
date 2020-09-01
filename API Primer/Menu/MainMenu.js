class Menu_Main {
  constructor(UI) {
    this.Menu_Main = new Menu(UI, 'API Serpstat');
    this.Menu_Main.CreateMenu('Refresh',`MainItems.item1`);
    this.Menu_Main.CreateMenu('Sorting by groups',`MainItems.item2`);
    this.Menu_Main.CreateMenu(`Authentication`, `MainItems.item3`);
    this.Menu_Main.CreateMenu(`Reset OAuth`, `MainItems.item4`);
    this.Menu_Main.CreateMenu(`Debug JSON Sites`, `MainItems.item5`);
    this.Menu_Main.CreateMenu(`Debug JSON Sitemap Get`, `MainItems.item6`);
    this.Menu_Main.CreateMenu(`Debug JSON Sitemap Set`, `MainItems.item7`);
    this.Menu_Main.CreateMenu(`Debug JSON Sitemap Delete`, `MainItems.item8`);
    this.Menu_Main.CreateMenu(`Active Range Sitemap Set`, `MainItems.item9`);
  }
}

var MainItems = {
  item1: () => { RefreshRange() },
  item2: () => { Сlustering() },
  item3: () => { accessProtectedResource('https://www.googleapis.com/webmasters/v3/sites')},
  item4: () => { resetOAuth()},
  item5: () => {
    let URLs = GSC_getSitesJSON();
    showMessageBox(`Array`, JSON.stringify(URLs));
    let SS = SpreadsheetApp.getActiveSheet();
    let A1 = SS.getCurrentCell();
    let range = SS.getRange(A1.getRow(), A1.getColumn(), URLs.length, URLs[0].length);
    range.setValues(URLs);
  },
  item6: () => { GSC_ForMenu(GSC_getSitemap, 1)},
  item7: () => { GSC_ForMenu(GSC_setSitemap, 1)},
  item8: () => { GSC_ForMenu(GSC_deleteSitemap, 1)},
  item9: () => { 
    let range = SpreadsheetApp.getSelection().getActiveRange();
    showMessageBox(range.getA1Notation());
    let Values = range.getValues();
    showMessageBox(`Array: `, JSON.stringify(Values));
    for (let i = 0; i < Values.length; i++) {
      if (Array.isArray(Values[i]) == true & Values[i].length > 1) {
        return showMessageBox(`Array`, `Need one-dimensional array`);
      }
      GSC_setSitemap(encodeURIComponent(Values[i]));
    }
  }
}