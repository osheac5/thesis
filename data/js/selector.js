var text = "";
text = window.getSelection().toString();

$('head').append('<link rel="stylesheet" href="highlight.css" type="text/css" />');

$("p:contains("+text+")").css("background-color", "yellow");
