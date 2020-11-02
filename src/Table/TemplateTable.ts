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
