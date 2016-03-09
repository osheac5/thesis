var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var simpleStorage = require('sdk/simple-storage');

simpleStorage.storage.annotations = [];

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Save Resource",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  sidebar.show();
  tabs.activeTab.attach({
    contentScriptFile: [self.data.url('js/jquery-2.1.4.min.js'),
                        self.data.url('js/jquery.highlight-5.js'),
                        self.data.url('js/selector.js')]
    });
}

function myListener() {
  console.log(selection.text);
}

var selection = require("sdk/selection");
selection.on('select', myListener);

var ui = require("sdk/ui");
var sidebar = ui.Sidebar({
  id: 'tags-sidebar',
  title: 'Add Tags',
  url: require("sdk/self").data.url("sidebar.html"),
  onReady: function (worker) {
    worker.port.emit("highlighted-text", selection.text);
    worker.port.on("data", function(data) {
      console.log("Index: " + data);
      simpleStorage.storage.annotations.push(data);
      console.log(simpleStorage.storage.annotations);
      sidebar.hide();
    });
    /*worker.port.on("data", function(data) {
      if (!simpleStorage.storage.annotations) {
        simpleStorage.storage.annotations = [];
      }
      
      function handleNewAnnotation(data, anchor) {
        var newAnnotation = new Annotation(annotationText, anchor);
        simpleStorage.storage.annotations.push(newAnnotation);
      }
      console.log(data + "123");
    });*/
  }
});
/*
var panel = require("sdk/panel").Panel({
  width: 180,
  height: 180,
  contentURL: "https://en.wikipedia.org/w/index.php?title=Jetpack&useformat=mobile"
});
*/
/* -------- *** ------- */
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  width: 350,
  height: 280,
  contentURL: self.data.url("panel.html"),
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}
