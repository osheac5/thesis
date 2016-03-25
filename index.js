var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var simpleStorage = require('sdk/simple-storage');

simpleStorage.storage.text = [];
simpleStorage.storage.count = 0;
simpleStorage.storage.annotations = [];
simpleStorage.storage.urls = [];
simpleStorage.storage.times = [];

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
    worker.port.on("annotations", function(data) {
      console.log("Annotations: " + data);
      
      var annotation = [simpleStorage.storage.count, Date.now(), tabs.activeTab.url, data[0], data[1]]
      simpleStorage.storage.annotations.push(annotation);
      simpleStorage.storage.urls.push(tabs.activeTab.url);
      console.log(simpleStorage.storage.annotations);
      sidebar.hide();
    });
  }
});

/* -------- PANEL ------- */
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
  width: 500,
  height: 280,
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  onShow: function (worker) {
    panel.port.emit("annotations", simpleStorage.storage.annotations);
  }
});
/*
function onShowing() {
  console.log("panel is showing");
}
*/
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
