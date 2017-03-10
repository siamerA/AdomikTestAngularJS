// Set our margins
var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 60
},
width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

// Our X scale
var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

// Our Y scale
var y = d3.scale.linear()
        .rangeRound([height, 0]);

// Our color bands
var color = d3.scale.ordinal()
        .range(["#308fef", "#5fa9f3", "#1176db"]);

// Use our X scale to set a bottom axis
var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

// Smae for our left axis
var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

// Add our chart to the document body
var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

'use strict';

angular.module('myApp')
        .service('chartService', function () {

            return {
                buildChart: function (data) {
                    // Use our values to set our color bands
                    color.domain(d3.keys(data[0]).filter(function (key) {
                        return key !== "date";
                    }));

                    _.each(data, function (d) {
                        var y0 = 0;
                        d.types = color.domain().map(function (name) {
                            return {
                                name: name,
                                y0: y0,
                                y1: y0 += +d[name]
                            };
                        });
                        d.total = d.types[d.types.length - 1].y1;
                    });

                    // Our X domain is our set of years
                    x.domain(data.map(function (d) {
                        return d.date;
                    }));

                    // Our Y domain is from zero to our highest total
                    y.domain([0, d3.max(data, function (d) {
                            return d.metric;
                        })]);

                    console.log(data);

                    svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                    svg.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                            .append("text")

                    var date = svg.selectAll(".date")
                            .data(data)
                            .enter().append("g")
                            .attr("class", "g")
                            .attr("transform", function (d) {
                                return "translate(" + x(d.date) + ",0)";
                            });

                    date.selectAll("rect")
                            .data(function (d) {
                                return d.types;
                            })
                            .enter().append("rect")
                            .attr("width", x.rangeBand())
                            .attr("y", function (d) {
                                return y(d.y1);
                            })
                            .attr("height", function (d) {
                                return y(d.y0) - y(d.y1);
                            })
                            .style("fill", function (d) {
                                return color(d.name);
                            });

                    var legend = svg.selectAll(".legend")
                            .data(color.domain().slice().reverse())
                            .enter().append("g")
                            .attr("class", "legend")
                            .attr("transform", function (d, i) {
                                return "translate(0," + i * 20 + ")";
                            });

                    legend.append("rect")
                            .attr("x", width - 18)
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", color);

                    legend.append("text")
                            .attr("x", width - 24)
                            .attr("y", 9)
                            .attr("dy", ".35em")
                            .style("text-anchor", "end")
                            .text(function (d) {
                                return d;
                            });
                }
            }

        });

