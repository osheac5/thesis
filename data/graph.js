var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y = d3.scale.linear()
    .range([height, 0]);
    
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(1, "d");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
addon.port.on("annotations", function(message) {
    var tags = [];
    var hist = [];
    for (i = 0; i < message.length; i++){
        tags.push(message[i][4]);
    }
    for (i = 0; i < tags.length; i++){
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
    
    var data = hist;
    
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
  
    var barWidth = width / data.length;
  
    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
        
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");
  
    bar.append("rect")
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", barWidth - 1);
  
    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return y(d.value) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.value; });
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
