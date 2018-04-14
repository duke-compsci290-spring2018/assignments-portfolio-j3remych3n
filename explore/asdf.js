var rawData = {"dates":[], "amt":[], "description":[]};
var dUrl = "https://raw.githubusercontent.com/duke-compsci290-spring2018/assignments-portfolio-j3remych3n/master/explore/Checking1.csv?token=ALIe7gKFF8ZS3J5vhefAYIbgcoSUAuQqks5a2qoHwA%3D%3D";

var dayTotals = { "dates":[], "net":[], "spending":[]};


var loadData = function(){
   return d3.csv(dUrl, function(data) {
        rawData.dates.push(data.date);
        rawData.amt.push(+data.amt);
        rawData.description.push(data.description);

        if (dayTotals.dates.indexOf(data.date) < 0){
            dayTotals.dates.push(data.date);
            dayTotals.net.push(+data.amt);
            dayTotals.spending.push(0);
            if(+data.amt <= 0){
                dayTotals.spending[dayTotals.dates.indexOf(data.date)] = +data.amt;
            }
        }
        else {
            dayTotals.net[dayTotals.dates.indexOf(data.date)] += +data.amt;

            if(+data.amt<=0){
                dayTotals.spending[dayTotals.dates.indexOf(data.date)] += +data.amt;
            }

        }
    }
);
    // console.log(rawData);
}

var showBuble = function() {
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
    // var ind;
    // for(ind = 0; ind<rawData.dates.length; ind++){
    //     //create hierarchy for organizing bubbles
    //     var root = d3.hierarchy({children: rawData.amt[ind]})
    //         .sum(Math.abs(rawData.amt[ind]))
    //         .each(function(d) {
    //             if (id = d.data.id) {
    //                 var id, i = id.lastIndexOf(".");
    //                 d.id = id;
    //                 d.package = id.slice(0, i);
    //                 d.class = id.slice(i + 1);
    //             }
    //         });
    // }
}
//https://www.crowdanalytix.com/communityBlog/10-steps-to-create-calendar-view-heatmap-in-d3-js
var showHeatmap = function() {
    var svg = d3.select("#date_heatmap"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    svg.attr('class', 'chart');

    // calendar cell size
    var cellSize = 15;

    // parsing csv
    var percent = d3.format(".1%");
        // format = d3.time.format("%m/%d/%y");
    // red as darkest, white as lightest
    console.log(d3.scale);
    var color = d3.scale.linear().range(["white", "#4c0309"]);

    // Copied formatting for month labels, takes list of months and adds as labels w/ formatting
    month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    legend.append("text")
        .attr("class", function(d,i){ return month[i] })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d,i){ return month[i] });

    // Copied formatting for week labels, takes list of days of weeks and adds as labels w/ formatting
    week_days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    svg.append("text")
        .attr("transform", "translate(-5," + cellSize*(i+1) + ")")
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d) { return week_days[i]; });

}

// http://alignedleft.com/tutorials/d3/making-a-bar-chart
var showHist = function() {
    var svg = d3.select("#histogram"),
        width = +svg.attr("width"),
        height = +svg.attr("height");
    var asdf = dayTotals.net;
    var heightRatio = (height/2)/Math.max.apply(null, dayTotals.net.map(Math.abs));
    var widthRatio = width/dayTotals.net.length;

    svg.selectAll("rect")
        .data(dayTotals.net)
        .enter()
        .append("rect")
        .attr("x", function(d){
            return widthRatio * dayTotals.net.indexOf(d);
        })
        .attr("y",function(d){
            if(d>0){
                return height/2 - d*heightRatio;
            }
            else{
                return height/2;
            }
        })
        .attr("width", widthRatio)
        .attr("height", function(d){
            return Math.abs(d*heightRatio);
        })
        .attr("fill", function(d){
            if(d>0){
                return "green";
            }
            else{
                return "red";
            }
        });
}

loadData().then(function(){
        dayTotals.net.reverse();
        dayTotals.dates.reverse();
        dayTotals.spending.reverse();
        console.log(dayTotals.spending);
        showHeatmap();
        showHist();

    }
);

