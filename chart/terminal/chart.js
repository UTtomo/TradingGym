
// 外部ファイルindex.jsを読み込み、chart.jsにいれる！
// んで、送り速度を変更できるようにする
var display= [
        {number: "1", height: "1", width: "1"},
        {number: "2", height: "1", width: "0.5"},
        {number: "3", height: "1", width: "0.33"},
        {number: "4", height: "0.5", width: "0.5"},
        {number: "5", height: "1", width: "0.2"},
        {number: "6", height: "0.5", width: "0.33"},
];



// definition of function and variable
function chart(name, symbol, fullWidth, fullHeight) {

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = window.innerWidth - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom;

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

    var trendline = techan.plot.trendline()
            .xScale(x)
            .yScale(y)
            .on("mouseenter", enter)
            .on("mouseout", out)
            .on("drag", drag);

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
            .attr("height", height + margin.top + margin.bottom)
            .attr('id', symbol);

    var defs = svg.append("defs");
    


// cursor information
    defs.append("clipPath")
            .attr("id", "ohlcClip")
        .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height);

// y axis
    svg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
   
            

//the whole chart
    var ohlcSelection = svg.append("g")
            .attr("class", "ohlc")
            .attr("transform", "translate(0,0)");
// volume
    ohlcSelection.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#ohlcClip)");
// candlestick
    ohlcSelection.append("g")
            .attr("class", "candlestick")
            .attr("clip-path", "url(#ohlcClip)");
// moving
    ohlcSelection.append("g")
            .attr("class", "indicator sma ma-0")
            .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
            .attr("class", "indicator sma ma-1")
            .attr("clip-path", "url(#ohlcClip)");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

    svg.append("g")
            .attr("class", "volume axis");
    svg.append("g")
            .attr("class", "trendlines");

    svg.append('g')
            .attr("class", "crosshair ohlc");
    svg.append("g")
            .attr("class", "trendlines analysis")
            .attr("clip-path", "url(#ohlcClip)");

    svg.append('g')
            .attr("class", "crosshair ohlc");

    var valueText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);

    var coordsText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);

    var feed;





    d3.csv("data/"+symbol+".csv", function(error, csv) {
        var accessor = ohlc.accessor();

        feed = csv.map(function(d) {
       
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        // 描画範囲を指定
        redraw(feed.slice(0, 163), trendlineData.slice(0, trendlineData.length-1));
        d3.select("button").on("click", function() { draw(data, trendlineData); }).style("display", "inline");
        
    });
    





    
    
    function redraw(data) {
        var trendlineData = [
                { start: { date: new Date(2014, 2, 11), value: 72.50 }, end: { date: new Date(2014, 5, 9), value: 63.34 } },
                { start: { date: new Date(2013, 10, 21), value: 43 }, end: { date: new Date(2014, 2, 17), value: 70.50 } }
            ];

        // console.log(trendlineData);
        //     console.log(data);
        var accessor = ohlc.accessor();
        var shiftTime ={
                "m1":{"time":1},
                "m5":{"time":5},
                "m15":{"time":15},
                "m30":{"time":30},
                "h1":{"time":60},
                "h4":{"time":240},
                "d1":{"time":1440},
                "w1":{"time":10080}
        };
        

        x.domain(data.map(accessor.d));
        // Show only 150 points on the plot
        x.zoomable().domain([data.length-130, data.length]);

        // Update y scale min max, only on viewable zoomable.domain()
        y.domain(techan.scale.plot.ohlc(data.slice(data.length-130, data.length)).domain());
        yVolume.domain(techan.scale.plot.volume(data.slice(data.length-130, data.length)).domain());

        // Setup a transition for all that support
        svg
//          .transition() // Disable transition for now, each is only for transitions
            .each(function() {
                var selection = d3.select(this);
                selection.select('g.x.axis').call(xAxis);
                selection.select('g.y.axis').call(yAxis);
                selection.select("g.volume.axis").call(volumeAxis);
                // selection.select("g.trendlines").datum(trendlineData).call(trendline).call(trendline.drag);
                // svg.selectAll("g.trendlines").datum(trendlineData).call(trendline).call(trendline.drag);
                selection.select("g.candlestick").datum(data).call(ohlc);
                selection.select("g.sma.ma-0").datum(sma0Calculator(data)).call(sma0);
                selection.select("g.sma.ma-1").datum(sma1Calculator(data)).call(sma1);
                selection.select("g.volume").datum(data).call(volume);
                svg.selectAll("g.trendlines").datum(trendlineData).call(trendline).call(trendline.drag);
                svg.select("g.trendlines").call(trendline.refresh);
                svg.select("g.crosshair.ohlc").call(crosshair);
            });
        var candle = symbol.split('-');
        // console.log(candle[1]);
        var key = candle[1];
        // console.log(shiftTime[key]["time"]);
     

        // $('#range' , parent.document).text(price).val();

        // function timeGet(value){
        //         console.log(value);
        //         var time = value;
        //         return time;
        // }
        
        // console.log(window.parent.getValue());
// 
        // Set next timer expiry
        setTimeout(function() {
            var newData;
            var Data;
            var spread = 0.1;
            var price;
            var priceSell =0;
            var date;
            
            

            if(data.length < feed.length) {
                // Simulate a daily feed
                newData = feed.slice(0, data.length+1);
                Data = newData[newData.length - 1];
                date = Data.date;
                price = parseFloat(Data.close);
                // console.log(price);
                
                
                $(function(){
                        // console.log(date);
                        $('#date' , parent.document).text(date);
                        price = price.toPrecision(4);
                        $('#price-buy' , parent.document).text(price).val();
                        
                        priceSell = price - spread;
                        priceSell = Math.round(priceSell * Math.pow(10,2))/Math.pow(10,2);

                        priceSell = priceSell.toPrecision(4);
                        $('#price-sell' , parent.document).text(priceSell).val();

                        function Buy(){
                                $('#log' , parent.document).append(price).val();
                                
                        }
                    
                });
                
            }
            else {
                // Simulate intra day updates when no feed is left
                var last = data[data.length-1];
                // Last must be between high and low
                last.close = Math.round(((last.high - last.low)*Math.random())*10)/10+last.low;

                newData = data;
            }

            redraw(newData);
        }, (window.parent.getValue()*50)); // Randomly pick an interval to update the chart
    }
    function enter(d) {
        console.log("touch");
        valueText.style("display", "inline");
        refreshText(d);
    }

     function out(d) {
        console.log("touch");
        valueText.style("display", "none");
    }

     function drag(d) {
        console.log("touch");
        refreshText(d);
    }
    function refreshText(d) {
        valueText.text(
            "Start: [" + timeFormat(d.start.date) + ", " + valueFormat(d.start.value) +
            "] End: [" + timeFormat(d.end.date) + ", " + valueFormat(d.end.value) + "]"
        );
    }

    function move(coords) {
        coordsText.text(
                timeAnnotation.format()(coords.x) + ", " + ohlcAnnotation.format()(coords.y)
        );
    }
}

var trendlineData = [
        { start: { date: new Date(2014, 1, 11), value: 47 }, end: { date: new Date(2014, 5, 9), value: 63.34 } },
        { start: { date: new Date(2013, 10, 21), value: 43 }, end: { date: new Date(2014, 2, 17), value: 70.50 } }
    ];



// -----------------------------------
var displayNum = 4;

