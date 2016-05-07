var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var simpleStorage = require('sdk/simple-storage');
var request = require("sdk/request").Request;
var tags = [];


simpleStorage.storage.text = [];
simpleStorage.storage.count = 0;
simpleStorage.storage.annotations = [];
simpleStorage.storage.urls = [];
simpleStorage.storage.times = [];
simpleStorage.storage.annotationsList = [];

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
}

var selection = require("sdk/selection");
selection.on('select', myListener);

var ui = require("sdk/ui");
var sidebar = ui.Sidebar({
  id: 'tags-sidebar',
  title: 'Add Tags',
  url: require("sdk/self").data.url("sidebar.html"),
  onReady: function (worker) {
    input = selection.text; 
    request({
      url: "http://spotlight.sztaki.hu:2222/rest/annotate",
      content: {text : input,
        confidence: 0.5,
        support : 0},
      onComplete: function (response) {
        tags = [];
        var res = response.text;
        var n = res.search("dbpedia.org/resource/");
        while (n != -1) {
          n = n + 21;
          res = res.substring(n);
          m = res.search("\"");
          tag = res.substring(0, m)
          if (tags.indexOf(tag) < 0) {
            tags.push(tag);
          }
          
          n = res.search("dbpedia.org/resource/");
        }
        console.log(tags);
        var message = [selection.text, tags];
        worker.port.emit("highlighted-text", message);
      }
    }).post();
    
    worker.port.on("annotations", function(data) {
      var annotation = [simpleStorage.storage.count, Date.now(), tabs.activeTab.url, data[0], data[1]];
      simpleStorage.storage.annotations.push(annotation);
      sidebar.hide();
    });
  }
});

/* -------- PANEL ------- */
var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

var button = ToggleButton({
  id: "show-annotations",
  label: "show annotations",
  icon: {
    "16": "./table-icon-16.png",
    "32": "./table-icon-32.png",
    "64": "./table-icon-64.png"
  },
  onChange: handleChange
});

var panel = panels.Panel({
  width: 800,
  height: 280,
  contentURL: self.data.url("panel.html"),
  onHide: handleHide,
  onShow: function (worker) {
    panel.port.emit("annotations", simpleStorage.storage.annotations);
    panel.port.on("url", function(url) {
      console.log("At index - url: " + url);
      if (typeof url == "number") {
        console.log("Annotations before: " + simpleStorage.storage.annotations);
        simpleStorage.storage.annotations.splice(url, 1);
        console.log("Annotations after: " + simpleStorage.storage.annotations)
      }
      else{
        tabs.open(url);
      }
      panel.hide();
    });
  }
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

/* -------- VISUALISATION ------- */

var visbutton = ToggleButton({
  id: "show-visualisation",
  label: "show visualisation",
  icon: {
    "16": "./graph-icon-16.png",
    "32": "./graph-icon-32.png",
    "64": "./graph-icon-64.png"
  },
  onChange: toggleGraph
});

var graphPanel = panels.Panel({
  width: 850,
  height: 800,
  contentURL: self.data.url("graph.html"),
  onHide: handleHide,
  onShow: function (worker) {
    graphPanel.port.emit("annotations", simpleStorage.storage.annotations);
  }
});

function toggleGraph(state) {
  if (state.checked) {
    graphPanel.show();
  }
}

