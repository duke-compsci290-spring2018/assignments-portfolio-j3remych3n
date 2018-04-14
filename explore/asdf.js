var rawData = {"dates":[], "amt":[], "description":[]};

var loadData = function(){
d3.csv("/Checking1.csv", function(data) {
    data.forEach(function(dt) {
        rawData.dates.push(dt.date);
        rawData.amt.push(+dt.amt);
        rawData.description.push(dt.description);
    });
});}

var showCircles = function() {
    d3.select("#circles");
}

var showHeatmap = function() {
    d3.select("#date_heatmap");
}

var showHist = function() {
    d3.select("#histogram");
}