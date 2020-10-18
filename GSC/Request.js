function GSC_ForMenu(GSC = Function, Control = 0) {
  let input = showInputBox(`Site`, `Input site URL: \r\n 'https://websiteURL/'`);
  if (input == CANCEL) { return };

  if (Control == 1) showMessageBox(`Input:`, input);

  if (input == null || input == `undefined`) {return `No address`};
  input = encodeURIComponent(input);
  if (Control == 1) showMessageBox(`Encode:`, input);
  GSC(input, Control);
}

function GSC_request(SERVICE, method, param, CompletedStat = 0) {
  let json = accessProtectedResource(SERVICE, method, {}, param, CompletedStat);
  if (CompletedStat == 1) showMessageBox(`Completed`, json);
  try {
    return json_parse = JSON.parse(json);
  } catch(err) {
    return json;
  }
}

function GSC_getSitesJSON() {
  let request = GSC_request(SERVICE_Sites, `GET`, false, 1);
  var URLs = []
  for (var i in request.siteEntry) {
    URLs.push([request.siteEntry[i].siteUrl, request.siteEntry[i].permissionLevel]); 
  }
  return URLs;
}

function GSC_getSitemaps(URLs = Array) {
  let service = new RequestToService();
  let CheckContinue;
  if (!isArray(URLs)) {
    CheckContinue = showMessageBox(`Not Array`,
    `Do you want to take a sitemap?`);
    if (CheckContinue == CANCEL) {
      return
    }
    service.Request()
  }
  if (CheckContinue == OK) {
    for (let i = 0; i < URLs.length; i++) {
      
    }
  }
}

function GSC_getSitemap(input, Query_Debug = 0) {
  let query = SERVICE_Sitemap(input, `${input}sitemap.xml`);
  if (Query_Debug == 1) showMessageBox(`Request: `, query);
  let response = GSC_request(query, `GET`, false, Query_Debug);
  let SS = SpreadsheetApp.getActiveSheet();
  let range = SS.getCurrentCell();
  let column = range.getColumn();
  let row = range.getRow();
  let responseArray = [[]];
  let counter = 0;
  for (let i in response) { 
    responseArray[0][counter] = response[i];
    counter++;
  }
  showMessageBox(`Debug`, JSON.stringify(responseArray))
  let range_new = SS.getRange(row, column, 1, counter);
  range_new.setValues(responseArray);
}

function GSC_setSitemap(input, Query_Debug = 0) {
  let query = SERVICE_Sitemap(input, `${input}sitemap.xml`)
  if (Query_Debug == 1) showMessageBox(`Request: `, query);
  GSC_request(query, `PUT`, false, Query_Debug);
}

function GSC_deleteSitemap(input, Query_Debug = 0) {
  let query = SERVICE_Sitemap(input, `${input}sitemap.xml`);
  if (Query_Debug == 1) showMessageBox(`Request: `, query);
  let request = GSC_request(query, `DELETE`, false, Query_Debug);
}