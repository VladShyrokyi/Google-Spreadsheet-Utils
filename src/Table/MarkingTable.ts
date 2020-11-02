class MarkingTable extends TemplateTable {
  _base: string = `http://api.serpstat.com/v3/`;
  _reportType: string[] = [`domain_keywords`, `keywords`];
  _query: element[][] = [[], []];
  _token: string = `84a70800e984ef048ae0e352d2e093ed`;
  _searchRegion: string = `g_ua`;

  Keys: string[];
  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    super({ sheet, RowStart: 1, ColumnStart: 1, height: 5, width: 2 });
    let domain = `Domain`;
    let keywords = `Keywords`;
    this.getHeader().find(
      (headerName, index) =>
        (headerName == domain &&
          this.getValues().forEach((r) => this._query[0].push(r[index]))) ||
        (headerName == keywords &&
          this.getValues().forEach((r) => this._query[1].push(r[index])))
    );
    this.Keys = [];
  }
  FetchToAPI(): MarkingTable {
    let URLs: API[] = [];
    this._query.forEach((e, i) =>
      e.forEach((q) =>
        URLs.push(
          new API(
            new URI(
              CreateAPI(
                this._base,
                this._reportType[i],
                q.toString(),
                this._token,
                this._searchRegion
              )
            )
          )
        )
      )
    );
    this.Keys = URLs.map((str) => str.FetchQuery());
    return this;
  }
  GiveValuesFromAPI(): element[][] {
    let result = `result/hits`;
    let resultArr: element[][] = [];
    this.Keys.forEach((e) => {
      let Data = GiveFromCache(e, result);
      Array.isArray(Data)
        ? Data.forEach((Row) =>
            resultArr.push(
              Array.isArray(Row)
                ? Row //.map((Value) => Value)
                : [Row]
            )
          )
        : resultArr.push([Data]);
    });
    return resultArr;
  }
}

function MarkingQuery() {
  let sheet = SpreadsheetApp.getActiveSheet();
  let template = new MarkingTable(sheet);
  let Values = template.FetchToAPI().GiveValuesFromAPI();
  let lengthMax = Values.reduce(
    (max, e, i, arr) => (max > e.length ? max : e.length),
    0
  );
  let CorrectedValues: element[][] = Values.map((arr) => {
    arr.length = lengthMax;
    return arr;
  });
  let range = sheet.getRange(1, 3, CorrectedValues.length, lengthMax);
  range.setValues(Values);
}
