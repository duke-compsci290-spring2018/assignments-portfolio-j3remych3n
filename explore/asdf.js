var rawData = {"dates":[], "amt":[], "description":[]};
var dUrl = "https://raw.githubusercontent.com/duke-compsci290-spring2018/assignments-portfolio-j3remych3n/master/explore/Checking1.csv?token=ALIe7gKFF8ZS3J5vhefAYIbgcoSUAuQqks5a2qoHwA%3D%3D";

var loadData = function(){
    d3.csv(dUrl, function(data) {
        rawData.dates.push(data.date);
        rawData.amt.push(+data.amt);
        rawData.description.push(data.description);
    }
);
    console.log(rawData);
}

var buble = function() {
    // Inspired by: https://bl.ocks.org/mbostock/4063269
    // select svg element
    var svg = d3.select("#circles"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // load bubble d3 pack
    var bubble = d3.pack()
        .size([300, 300])
        .padding(1);

    // Loop over each entry
    var ind;
    for(ind = 0; ind<rawData.dates.length; ind++){
        //create hierarchy for organizing bubbles
        var root = d3.hierarchy({children: rawData.amt[ind]})
            .sum(Math.abs(rawData.amt[ind]))
            .each(function(d) {
                if (id = d.data.id) {
                    var id, i = id.lastIndexOf(".");
                    d.id = id;
                    d.package = id.slice(0, i);
                    d.class = id.slice(i + 1);
                }
            });
    }
}

var showHeatmap = function() {
    var svg = d3.select("#date_heatmap"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
}

var showHist = function() {
    var svg = d3.select("#histogram"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
}

loadData();