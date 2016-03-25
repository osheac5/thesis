textsave = "";

addon.port.on("highlighted-text", function(message) {
  
  document.getElementById("tag-input").focus();
  
  textsave = message;

  if (message.length > 150) {
    message = message.substring(0, 150);
    message = message.concat("...\"");
    prefix = "\""
    message = prefix.concat(message);
  }
  
  document.getElementById("highlighted-text").innerHTML = message;
  
});

function onSave() {
  console.log("onSave");
  var annotations = jQuery(".tag-input").tagsManager('tags');
  
  var data = [textsave, annotations];
  addon.port.emit("annotations", data);
}