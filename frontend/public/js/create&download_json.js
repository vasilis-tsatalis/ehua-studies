////////////////////////////////////////////////////////
function tableToJSON() {

  const table = document.querySelector('table')
  const [header] = table.tHead.rows
  const props = [...header.cells].map(h => h.textContent)
  const rows = [...table.rows].map(r => {
    const entries = [...r.cells].map((c, i) => {
      return [props[i], c.textContent]
    })
    return Object.fromEntries(entries)
  })
  console.log(rows)

}
////////////////////////////////////////////////////////
function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", 'exportName' + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
////////////////////////////////////////////////////////