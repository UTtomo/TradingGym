var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%d-%b-%y");

var x = techan.scale.financetime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var yVolume = d3.scaleLinear()
    .range([y(0), y(0.2)]);

var ohlc = techan.plot.candlestick()
    .xScale(x)
    .yScale(y);

var sma0 = techan.plot.sma()
    .xScale(x)
    .yScale(y);

var sma0Calculator = techan.indicator.sma()
    .period(10);

var sma1 = techan.plot.sma()
    .xScale(x)
    .yScale(y);

var sma1Calculator = techan.indicator.sma()
    .period(20);

var volume = techan.plot.volume()
    .accessor(ohlc.accessor())   // Set the accessor to a ohlc accessor so we get highlighted bars
    .xScale(x)
    .yScale(yVolume);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var volumeAxis = d3.axisRight(yVolume)
    .ticks(3)
    .tickFormat(d3.format(",.3s"));

var timeAnnotation = techan.plot.axisannotation()
    .axis(xAxis)
    .orient('bottom')
    .format(d3.timeFormat('%Y-%m-%d'))
    .width(65)
    .translate([0, height]);

var ohlcAnnotation = techan.plot.axisannotation()
    .axis(yAxis)
    .orient('left')
    .format(d3.format(',.2f'));

var volumeAnnotation = techan.plot.axisannotation()
    .axis(volumeAxis)
    .orient('right')
    .width(35);

var crosshair = techan.plot.crosshair()
    .xScale(x)
    .yScale(y)
    .xAnnotation(timeAnnotation)
    .yAnnotation([ohlcAnnotation, volumeAnnotation])
    .on("move", move);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var defs = svg.append("defs");