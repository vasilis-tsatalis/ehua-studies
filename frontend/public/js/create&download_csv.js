////////////////////////////////////////////////////////
function tableToCSV() {

    var csv_data = [];
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i].querySelectorAll('td,th');

        var csvrow = [];
        for (var j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerHTML);
        }

        // Combine each column value with comma
        csv_data.push(csvrow.join(","));
    }

    // Combine each row data with new line character
    csv_data = csv_data.join('\n');

    // Call this function to download csv file 
    downloadCSVFile(csv_data);

}
////////////////////////////////////////////////////////
function downloadCSVFile(csv_data) {

    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });

    var temp_link = document.createElement('a');

    // Download csv file
    let filename = new Date();
    temp_link.download = filename; //(.csv)
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    // Automatically click the link to
    // trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}
////////////////////////////////////////////////////////