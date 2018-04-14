var rawData = {"dates":[], "amt":[], "description":[]};

var loadData = function(){
d3.csv("/Checking1.csv", function(data) {
    data.forEach(function(dt) {
        rawData.dates.push(dt.date);
        rawData.amt.push(+dt.amt);
        rawData.description.push(dt.description);
    });
    console.log(rawData);
});}

loadData();

var buble = function() {
    var width = 750;
    var height = 750;

    buble.width = function(w){
        if(!argument.length){
            return width;
        }
        width = w;
        return buble;
    }

    buble.height = function(h){
        if(!argument.length){
            return height;
        }
        height = h;
        return buble;
    }

    var michael = function(){



    }

    return michael;
    // select svg element
    var svg = d3.select("#circles"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // load bubble d3 pack
    var bubble = d3.pack()
        .size([300, 300])
        .padding(1);

    //create hierarchy

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