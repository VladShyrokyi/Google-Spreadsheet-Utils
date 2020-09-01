/**
* Обновляет работу функций в ячейках из выбранного диапазонна
* @param _range адресс ячейки
* @customfunction
*/
function RefreshRange()
{
  let ss = SpreadsheetApp.getActiveSpreadsheet(); // Активная электронная таблица
  let ss_list = ss.getActiveSheet(); // Активный лист
  Logger.log(ss_list.getName());
  let Ram_range = ss_list.getActiveRange(); // Выбранный пользователем диапазон
  if (Ram_range == null) return showMessageBox('Выберите диапазон','Не выбран диапазон')
  else {let arr = Ram_range.getFormulas(); // Резервирование формул ячеек которые обновляются в масиве 
        Ram_range.clear({contentsOnly: true});
        for (i in arr) 
        {
          for (j in arr[i]) 
          {
            let row = +i +1; // выбранная строка
            let colum = +j +1; // выбранный столбец
            let cell = Ram_range.getCell(row, colum); // выбранная ячейка
            cell.setValue(arr[i][j]);
            Logger.log(cell.getValue());
          }
        }
  }
}
