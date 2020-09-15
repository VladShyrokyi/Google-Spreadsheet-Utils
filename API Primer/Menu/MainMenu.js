class Menu_Main {
  constructor(UI, Name = String) {
    this.Menu_Main = new Menu(UI, Name);
    console.log(this.name);
  }
  CreateMenu(names, numbers) {
    for (let number in numbers) {
      if (number == `name`) {

      } else {
        this.Menu_Main.CreateMenu(names[number], `${numbers.name}.${number}`);
      }
    }
  }
}

class MenuSERP extends Menu_Main {
  constructor(UI, Name) {
    super(UI, Name);
    this.CreateMenu(SERPitemsName, SERPitems);
  }
}

class MenuGSC extends Menu_Main {
  constructor(UI, Name = String) {
    super(UI, Name);
    this.CreateMenu(GSCitemsName, GSCitems);
  }
}

var SERPitems = {
  name: `SERPitems`,
  item1: () => { RefreshFormula() },
  item2: () => { Сlustering() }
}

var SERPitemsName = {
  item1: `Refresh`,
  item2: `Sorting by groups`
}

var GSCitems = {
  name: `GSCitems`,
  item1: () => { accessProtectedResource('https://www.googleapis.com/webmasters/v3/sites')},
  item2: () => { resetOAuth()},
  item3: () => {
    let URLs = GSC_getSitesJSON();
    showMessageBox(`Array`, JSON.stringify(URLs));
    let SS = SpreadsheetApp.getActiveSheet();
    let A1 = SS.getCurrentCell();
    let range = SS.getRange(A1.getRow(), A1.getColumn(), URLs.length, URLs[0].length);
    range.setValues(URLs);
  },
  item4: () => { GSC_ForMenu(GSC_getSitemap, 1)},
  item5: () => { GSC_ForMenu(GSC_setSitemap, 1)},
  item6: () => { GSC_ForMenu(GSC_deleteSitemap, 1)},
  item7: () => { 
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

var GSCitemsName = {
  item1: `Authentication`,
  item2: `Reset OAuth`,
  item3: `Get Sites (To Active Range)`,
  item4: `Sitemap Get`,
  item5: `Sitemap Set`,
  item6: `Sitemap Delete`,
  item7: `Active Range Sitemap Set`
}