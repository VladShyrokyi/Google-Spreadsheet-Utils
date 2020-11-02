function Grouping() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let range = sheet.getDataRange();
  let data = new Table(range);
  let res = CustomUI.showInputBox(
    `Clustering`,
    `Enter the line number from which the grouping will start and the number of the column by which it will be sorted \r\n
		Example: "Row = 2; Column = 1" (Default values)`
  );
  let Input: number[] = [];
  if (res == CustomUI.CANCEL()) return;
  else if (res == ``) (Input[0] = 2) && (Input[1] = 1);
  else
    res
      .toString()
      .split(`; `)
      .forEach((e, i) => {
        Input[i] = parseInt(e.split(` = `)[1]);
      });
  data.Sorting(Input[0], Input[1]);
}
function CopyData() {
  let res = CustomUI.showInputBox(
    `Move active range`,
    `Enter the direction in which you want to move the range. \r\n
    Example: "0" (Row to down - Default values) or "1" (Column to right)`
  );
  let Input: number = 0;
  if (res == CustomUI.CANCEL()) return;
  else if (res == 1) Input = res;
  else if (res == 0) Input = res;
  else if (res == ``) Input = 0;
  else CustomUI.showMessageBox(`Error`, `Invalid input`);
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getActiveSheet();
  let data = new ActiveTable(sheet);
  data.CopyOffset(Input);
}
