var tags = [];
var hist = [];
var workingSet = [0, 5];
var annotationsMessage;
var data;
var chart_div;
var new_div;

var margin = {top: 20, right: 20, bottom: 150, left: 40},
    width = 800 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "d");
    
addon.port.on("annotations", function(message) {
    
    annotationsMessage = message;
    fillHist(message);
    drawChart();
});

function moveBack() {
    console.log("in moveBack");
    if (workingSet[0] > 0) {
        workingSet[0] = workingSet[0] - 1;
        workingSet[1] = workingSet[1] - 1;
        fillHist(annotationsMessage);
        drawChart();
    }
    console.log("working set: " + workingSet[0] + " - " + workingSet[1]);
}

function moveForward() {
    console.log("in moveForward");
    if (workingSet[1] < annotationsMessage.length) {
        workingSet[0] = workingSet[0] + 1;
        workingSet[1] = workingSet[1] + 1;
        fillHist(annotationsMessage);
        drawChart();
    }
    console.log("working set: " + workingSet[0] + " - " + workingSet[1]);
}

function type(d) {
  d.value = +d.value;
  return d;
}

function fillHist (message) {
    
    console.log("in fillHist");
    
    hist = [];
    tags = [];
    var min;
    var max;
    
    if (message.length < workingSet[1]) {
      min = 0;
      max = message.length - 1;
    }
    else {
      min = workingSet[0];
      max = workingSet[1];
    }
    
    for (i = min; i < max; i++){
        tags.push(message[i][4]);
    }
    
    console.log("Tags length: " + tags.length + " - Min: " + min + " - Max: " + max);
    
    for (i = 0; i < tags.length; i++){
        console.log("for loop: " + i);
        for (j = 0; j < tags[i].length; j++) {
            var flag = 0;
            for (k = 0; k < hist.length; k++) {
                if (tags[i][j] == hist[k].tag) {
                    hist[k].value = hist[k].value + 1;
                    flag = 1;
                }
            }
            if (flag == 0) {
                var newTag = {tag: tags[i][j], value: 1};
                hist.push(newTag);
            }
        }
    }
    data = hist;
    console.log("exiting fillHist")
}

function drawChart() {
    
    console.log("in drawChart");
    
    chart_div = document.getElementById("chart");
    new_div = document.createElement('div');
    new_div.setAttribute("id", "chart");
    chart_div.parentNode.replaceChild(new_div, chart_div);
    
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.tag; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
  
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", ".15em")
              .attr("transform", "rotate(-65)" );
  
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");
  
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.tag); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
        
     console.log("exiting drawChart");
}
