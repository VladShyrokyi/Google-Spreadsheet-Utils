/**
 * Updates the behavior of functions in cells from the selected range
 */
function RefreshCellFormula() {
	let ss = SpreadsheetApp.getActiveSpreadsheet();
	let sheet = ss.getActiveSheet();
	let range = sheet.getActiveRange();
	if (range == null) {
		return CustomUI.showMessageBox(``, ``);
	}
	let Array = range.getFormulas();
	range.clear({ contentsOnly: true });
	for (let i = 0; i < Array.length; i++) {
		for (let j = 0; j < Array[i].length; j++) {
			let row = i + 1;
			let colum = j + 1;
			let cell = range.getCell(row, colum);
			cell.setFormula(Array[i][j]);
		}
	}
}
