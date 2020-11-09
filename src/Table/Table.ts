interface ITable {
  readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;
  readonly _range: GoogleAppsScript.Spreadsheet.Range;
  readonly Rows: number;
  readonly Columns: number;
  readonly data: Data;
}
class Table implements ITable {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  _range: GoogleAppsScript.Spreadsheet.Range;
  Rows: number;
  Columns: number;
  data: Data;
  constructor(range: GoogleAppsScript.Spreadsheet.Range) {
    this._range = range;
    this.sheet = this._range.getSheet();
    this.Rows = this._range.getNumRows();
    this.Columns = this._range.getNumColumns();
    this.data = new Data().setData(this._range.getValues());
  }
  Sorting(StartRow: number, SortingColumn: number): Table {
    let maybeArray = this.data.getData();
    let maybeDoubleArray = Array.isArray(maybeArray) ? maybeArray : [[]];
    let checkArray = maybeDoubleArray.map((e) => (Array.isArray(e) ? e : [e]));
    let checkValue: element = this._range
      .getCell(StartRow, SortingColumn)
      .getValue();
    let Arr = [];
    for (let i = StartRow; i <= this.Rows; i++) {
      let Value = checkArray[i - 1][SortingColumn];
      if (Value == checkValue)
        Array.isArray(Arr[Arr.length - 1])
          ? Arr[Arr.length - 1].push(i)
          : Arr[0].push(i);
      else Arr.push([i]);
      checkValue = Value;
    }
    for (let i = 0; i < Arr.length; i++) {
      let Group = Arr[i];
      let Start = Group[1];
      let End = Group.length - 1;
      if (Start == null) Start = Group[0] + 1;
      if (End == 0) End = 1;
      try {
        this.sheet.getRowGroup(Start, 1)?.collapse(); //if Group has been
      } catch (error) {
        this.sheet
          .getRange(Start, SortingColumn, End)
          .shiftRowGroupDepth(1)
          .collapseGroups();
      }
    }
    return this;
  }
  //** directed 1 - column +: 0 - row + * /
  CopyOffset(directed: number = 0): Table {
    let rangeNew: GoogleAppsScript.Spreadsheet.Range;
    if (directed == 1) rangeNew = this._range.offset(0, this.Columns);
    else if (directed == 0) rangeNew = this._range.offset(this.Rows, 0);
    else rangeNew = this._range;
    this._range.copyTo(rangeNew);
    return this;
  }
}
class ActiveTable extends Table {
  constructor(readonly sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    super(sheet.getActiveRange() || sheet.getRange(1, 1));
  }
}

interface TemplateCreator {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  RowStart: number;
  ColumnStart: number;
  height: number;
  width: number;
}

class TemplateTable extends Table {
  private _header: element[] = [];
  private _values: element[][] = [];

  public getHeader(): element[] {
    return this._header;
  }
  public set header(value: element[] | element) {
    this._header = Array.isArray(value) ? value : [value];
  }
  public getValues(): element[][] {
    return this._values;
  }
  public set values(value: Array<element | element[]> | element) {
    this._values = Array.isArray(value)
      ? value.map((r) => (Array.isArray(r) ? r : [r]))
      : [[value]];
  }

  constructor(Options: TemplateCreator) {
    super(
      Options.sheet.getRange(
        Options.RowStart,
        Options.ColumnStart,
        Options.height,
        Options.width
      )
    );
    this.header = this.data.getHeader();
    if (Options.height > 1) this.values = this.data.sliceData(1);
  }
}

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
