function GSC_ForMenu(GSC = Function, Сontrol = 0) {
  let input = showInputBox(`Site`, `Input site URL: \r\n 'https://websiteURL/'`);
  if (input == CANCEL) { return };

  if (Сontrol == 1) showMessageBox(`Введено:`, input);

  if (input == null || input == `undefined`) {return `No address`};
  input = encodeURIComponent(input);
  if (Сontrol == 1) showMessageBox(`Закодировано:`, input);
  GSC(input, Сontrol);
}

function GSC_request(SERVICE, method, param, ComplitedStat = 0) {
  let json = accessProtectedResource(SERVICE, method, {}, param, ComplitedStat);
  if (ComplitedStat == 1) showMessageBox(`Complited`, json);
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

function GSC_getSitemap(input, Query_Debug = 0) {
  let query = SERVICE_Sitemap(input, `${input}sitemap.xml`);
  if (Query_Debug == 1) showMessageBox(`Запрос: `, query);
  let request = GSC_request(query, `GET`, Query_Debug);
  
}

function GSC_setSitemap(input, Query_Debug = 0) {
  let query = SERVICE_Sitemap(input, `${input}sitemap.xml`)
  if (Query_Debug == 1) showMessageBox(`Запрос: `, query);
  GSC_request(query, `PUT`, Query_Debug);
}

function GSC_deleteSitemap(input, Query_Debug = 0) {
  let query = SERVICE_Sitemap(input, `${input}sitemap.xml`);
  if (Query_Debug == 1) showMessageBox(`Запрос: `, query);
  let request = GSC_request(query, `DELETE`, Query_Debug);
}