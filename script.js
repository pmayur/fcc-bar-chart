var source =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let max;

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3
    .select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(source).then((data) => {
    var yearsDate = data.data.map(function (item) {
        return new Date(item[0]);
    });

    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    var xScale = d3
        .scaleTime()
        .domain([d3.min(yearsDate), xMax])
        .range([0, width]);

    var x = d3
        .scaleBand()
        .range([0, width])
        .domain(
            data.data.map(function (d, i) {
                return d[0];
            })
        );

    // x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    var y = d3.scaleLinear().domain([0, 20000]).range([height, 10]);

    svg.append("g").attr("id", "y-axis").call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(data.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", function (d) {
            return d[0];
        })
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("data-gdp", function (d) {
            return d[1];
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d[1]);
        })
        .attr("fill", "#69b3a2");
});
