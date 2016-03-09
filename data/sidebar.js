//var ss = require("sdk/simple-storage");

textsave = "";

addon.port.on("highlighted-text", function(message) {
  console.log(message);

  if (message.length > 100) {
    message = message.substring(0, 150);
    message = message.concat("...\"");
    prefix = "\""
    message = prefix.concat(message);
  }
  
  console.log(message);
  document.getElementById("highlighted-text").innerHTML = message;
  
  textsave = message;
  
});

function onSave() {
    addon.port.emit("data", textsave);
}

/*
var submit_button = document.getElementById("submit_button");
submit_button.addEventListener("click", sendData, false);

function sendData() {
  addon.port.emit("data", "data");
}
*/
/*if (!simpleStorage.storage.annotations) {
  simpleStorage.storage.annotations = [];
}

function handleNewAnnotation(annotationText, anchor) {
  var newAnnotation = new Annotation(annotationText, anchor);
  simpleStorage.storage.annotations.push(newAnnotation);
}

function Annotation(annotationText, anchor) {
  this.annotationText = annotationText;
  this.url = anchor[0];
  this.ancestorId = anchor[1];
  this.anchorText = anchor[2];
}
*/