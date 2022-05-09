////////////////////////////////////////////////////////
function tableToJSON() {

  var table = document.getElementId('jsontable');
  var jsonString = { Rows: [] };
  var $th = $(table).find('th');
  $(table).find('tbody tr').each(function (i, tr) {
      if (i > 0) {
          var obj = {};
          $tds = $(tr).find('td');
          $th.each(function (index, th) {
              obj[$(th).text()] = $tds.eq(index).text();
          });
          jsonString.Rows.push(obj);
      }
  });
  alert(JSON.stringify(jsonString));
}
////////////////////////////////////////////////////////
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
////////////////////////////////////////////////////////