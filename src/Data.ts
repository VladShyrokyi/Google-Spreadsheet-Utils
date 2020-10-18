interface IData {
	readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;
	readonly range: GoogleAppsScript.Spreadsheet.Range;
	readonly Rows: number;
	readonly Columns: number;
	readonly data: any[][];
}
class Data implements IData {
	range: GoogleAppsScript.Spreadsheet.Range;
	Rows: number;
	Columns: number;
	data: any[][];
	constructor(readonly sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		this.range = sheet.getDataRange();
		this.Rows = this.range.getNumRows();
		this.Columns = this.range.getNumColumns();
		this.data = this.range.getValues();
	}
	Sorting(StartRow: number, SortingColumn: number) {
		let checkValue: string | number = this.range
			.getCell(StartRow, SortingColumn)
			.getValue();
		let Arr = [];
		for (let i = StartRow; i <= this.Rows; i++) {
			let Value = this.data[i - 1][SortingColumn];
			if (Value == checkValue) {
				Array.isArray(Arr[Arr.length - 1])
					? Arr[Arr.length - 1].push(i)
					: Arr[0].push(i);
			} else {
				Arr.push([i]);
			}
			checkValue = Value;
		}
		// return CustomUI.showMessageBox(`Array`, JSON.stringify(Arr));
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
	}
	// directed 1 - column+: 0 - row+
	Copy(directed: number = 0) {
		let rangeNew: GoogleAppsScript.Spreadsheet.Range;
		if (directed == 1) rangeNew = this.range.offset(0, this.Columns);
		else if (directed == 0) rangeNew = this.range.offset(this.Rows, 0);
		else rangeNew = this.range;
		this.range.copyTo(rangeNew);
	}
}
class ActiveDate extends Data {
	constructor(readonly sheet: GoogleAppsScript.Spreadsheet.Sheet) {
		super(sheet);
		this.range = sheet.getActiveRange() || sheet.getRange(1, 1);
		this.Rows = this.range.getNumRows();
		this.Columns = this.range.getNumColumns();
		this.data = this.range.getValues();
	}
}
function Clustering() {
	let ss = SpreadsheetApp.getActiveSpreadsheet();
	let sheet = ss.getActiveSheet();
	let data = new Data(sheet);
	let res = CustomUI.showInputBox(
		`Clustering`,
		`Enter the line number from which the grouping will start and the number of the column by which it will be sorted \r\n
		Example: "Row = 2; Column = 1" (Default values)`
	);
	let Input: number[] = [];
	if (
		res == SpreadsheetApp.getUi().Button.CANCEL ||
		res == SpreadsheetApp.getUi().Button.CLOSE
	) {
		return;
	} else if (res == ``) {
		let Row = 2;
		let Column = 1;
		Input[0] = Row;
		Input[1] = Column;
	} else {
		let resArr = res.toString().split(`; `);
		resArr.map((e, i) => {
			Input[i] = parseInt(e.split(` = `)[1]);
		});
	}
	data.Sorting(Input[0], Input[1]);
}

function CopyData() {
	let res = CustomUI.showInputBox(
		`Move active range`,
		`Enter the direction in which you want to move the range. \r\n
    Example: "0" (Row to down - Default values) or "1" (Column to right)`
	);
	let Input: number = 0;
	if (
		res == SpreadsheetApp.getUi().Button.CANCEL ||
		res == SpreadsheetApp.getUi().Button.CLOSE
	)
		return;
	else if (res == 1) Input = res;
	else if (res == 0) Input = res;
	else if (res == ``) Input = 0;
	else CustomUI.showMessageBox(`Error`, `Invalid input`);
	let ss = SpreadsheetApp.getActiveSpreadsheet();
	let sheet = ss.getActiveSheet();
	let data = new ActiveDate(sheet);
	data.Copy(Input);
}
