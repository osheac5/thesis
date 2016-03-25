addon.port.on("annotations", function(message) {
  console.log(message);
  var table = document.getElementById("annotations-table");
  for (i = 0; i < message.length; i++) {
    var row = table.insertRow(1);
    
    var date = new Date(message[i][1]);
    var timestamp = date.toLocaleDateString("en-GB");
    
    var url = message[i][2];
    if (url.length > 35) {
    url = url.substring(0, 35);
    url = url.concat("...");
  }
    
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);

    cell0.innerHTML = timestamp;
    cell1.innerHTML = url
    cell2.innerHTML = message[i][3];
    cell3.innerHTML = message[i][4];
  }
});