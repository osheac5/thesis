textsave = "";

addon.port.on("highlighted-text", function(message) {
  
  var text = message[0];
  var tags = message[1];
  
  
  jQuery(".tag-input").tagsManager({prefilled: tags});
  document.getElementById("tag-input").focus();
  
  textsave = text;
  var shortened_text = text;

  if (shortened_text.length > 150) {
    shortened_text = text.substring(0, 150);
    shortened_text = shortened_text.concat("...\"");
    prefix = "\""
    shortened_text = prefix.concat(shortened_text);
  }

  document.getElementById("highlighted-text").innerHTML = shortened_text;
  
});

function onSave() {
  var annotations = jQuery(".tag-input").tagsManager('tags');
  
  var data = [textsave, annotations];
  addon.port.emit("annotations", data);
}