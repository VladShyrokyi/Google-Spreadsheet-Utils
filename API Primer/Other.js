/**
* Берет значении диапазона из введенного адресса ячейки
* @param _range адресс ячейки
* @customfunction
*/
function Cell_from(_range = Range)
{
  try
  {
    let ram = SpreadsheetApp.getActiveSheet().getRange(_range).getValue();
    return ram;
  }
  catch(err)
  {
    return "Empy Cell"
  }
}
/**
* Берет значение из заданного адреса заданного листа
* @param {Имя листа} List адресс ячейки
* @param {строка} Adress адресс ячейки
* @customfunction
*/
function Cell_List(List, Adress)
{
  let ss = SpreadsheetApp.getActive();
  let searchByName = ss.getSheetByName(List)
  let value = searchByName.getRange(Adress).getValue();
  return value;
}