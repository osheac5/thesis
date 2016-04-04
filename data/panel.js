addon.port.on("annotations", function(message) {
  
  var table = document.getElementById("annotations-table");
  var old_tbody = document.getElementById("annotations-table-body");
  var new_tbody = document.createElement('tbody');
  new_tbody.setAttribute("id", "annotations-table-body");
  
  for (i = 0; i < message.length; i++) {
    
    var row = new_tbody.insertRow();
    var date = new Date(message[i][1]);
    var timestamp = date.toLocaleDateString("en-GB");
    var tags = message[i][4];
    var spaceChar = " ";
    
    for (j = 1; j < tags.length; j++) {
      tags[j] = spaceChar.concat(tags[j]);
    }
    
    var url = message[i][2];
    if (url.length > 35) {
    url = url.substring(0, 35);
    url = url.concat("...");
    }
    
    var stext = message[i][3];
    if (stext.length > 150) {
    stext = stext.substring(0, 150);
    stext = stext.concat("...");
    }
    
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);

    cell0.innerHTML = timestamp;
    cell1.innerHTML = url
    cell2.innerHTML = stext;
    cell3.innerHTML = tags;
  }
  
  table.replaceChild(new_tbody, old_tbody);
});