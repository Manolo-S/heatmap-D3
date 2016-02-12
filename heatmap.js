'use strict';

var x;
var y;
var xAxis;
var yAxis;
var year;
var dataSourceUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

var colorScheme = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'];

var margin = {
    top: 50,
    right: 20,
    bottom: 100,
    left: 100
};

var width = 1200 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var parseYear = d3.time.format('%Y').parse;
var parseMonth = d3.time.format('%m').parse;



function xyAxis(data){
	
	x = d3.time.scale().range([0, width]);
	y = d3.time.scale().range([height, 0]);

	x.domain(d3.extent(data, function(d){ return parseYear(String(d.year));}));
	y.domain([parseMonth(String(12)), parseMonth(String(1))]);

	xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(26).tickFormat(d3.time.format('%Y'));
	yAxis = d3.svg.axis().scale(y).orient('left').ticks(11).tickFormat(d3.time.format('%B'));

}

function buildChart(data) {

	xyAxis(data);

	var maxVariance = d3.max(data, function(d) { return d.variance; });
	var minVariance = d3.min(data, function(d) { return d.variance; });

    var colorQuantize = d3.scale.quantize().domain([maxVariance, minVariance]).range(colorScheme); 


	var svg = d3.select("body")
			.append("svg").attr({
				width: width + margin.left + margin.right,
				height: height + margin.top + margin.bottom
			})
			.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	svg.append('g')
		.attr('class', 'y axis')
		.call(yAxis);


	svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr({
            x: function(d) {
                return x(parseYear(String(d.year)));
            },
            y: function(d) {
                return y(parseMonth(String(d.month)));
            },
            width: width / (data.length / 12),
            height: height / 12,
            fill: function(d) {return colorQuantize(d.variance)}
        })

        svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + (height + margin.bottom/2) + ')')
		.call(xAxis);

}

d3.json(dataSourceUrl, function(error, data) {

    if (error) {
        console.log(error);
    } else {
    	buildChart(data.monthlyVariance);
    }
});
