var tableData = [];
var clicked = 0;

addon.port.on("annotations", function(message) {
  
  var table = document.getElementById("annotations-table");
  var old_tbody = document.getElementById("annotations-table-body");
  var new_tbody = document.createElement('tbody');
  new_tbody.setAttribute("id", "annotations-table-body");
  
  for (i = 0; i < message.length; i++) {
    
    clicked = 0;
    var row = new_tbody.insertRow();
    var date = new Date(message[i][1]);
    var timestamp = date.toLocaleDateString("en-GB");
    var tags = message[i][4];
    var spaceChar = " ";
    var frontSpan = "<span onClick=\"tagClick(this)\">"
    var backSpan = "</span>"
    var url = message[i][2];
    
    tableData.push([timestamp, url, stext, tags]);
    
    for (j = 1; j < tags.length; j++) {
      tags[j] = spaceChar.concat(tags[j]);
    }
    
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
    var cell4 = row.insertCell(4);

    cell0.innerHTML = timestamp;
    cell0.setAttribute('onclick','rowClick(this);');
    cell1.innerHTML = url
    cell1.setAttribute('onclick','rowClick(this);');
    cell2.innerHTML = stext;
    cell2.setAttribute('onclick','rowClick(this);');
    cell3.innerHTML = tags;
    cell3.setAttribute('onclick','rowClick(this);');
    cell4.innerHTML = "x";
    cell4.setAttribute('onclick','deleteClick(this);');
  }
  
  table.replaceChild(new_tbody, old_tbody);
});

function deleteClick(cell) {
  if (clicked > 0) {
  }
  else{
    clicked = clicked + 1;
    row = cell.parentNode;
    index = row.rowIndex;
    row.parentNode.parentNode.deleteRow(index);
    addon.port.emit("url", index-1); 
  }
}

function rowClick(cell) {
  if (clicked > 0) {
  }
  else{
    clicked = clicked + 1;
    row = cell.parentNode;
    console.log("Row Clicked! " + tableData[row.rowIndex-1][1]);
    addon.port.emit("url", tableData[row.rowIndex-1][1]);
  }
}