// Viz 5
function createVisualization5(data) {
  var margin = { top: 50, right: 30, bottom: 40, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  dataset = data.filter(
    (d) =>
      d.MEASURE === "NURSES_P" &&
      d.TERRITORIAL_LEVEL === "TL2" &&
      d.REF_AREA.includes("AU") &&
      d.UNIT_MEASURE === "10P3HB",
  );

  var wideData = longToWide(
    dataset,
    "TIME_PERIOD", // group by year
    "Reference area", // regions become columns
    "OBS_VALUE", // the values
  );

  // Test the transformation
  console.log("Wide data:", wideData);

  // Create the svg
  var svg = d3
    .select("#viz5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get region names from wideData and test it
  var allKeys = Object.keys(wideData[0]);
  var keys = allKeys.filter((key) => key !== "TIME_PERIOD");

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain([
      d3.min(wideData, function (d) {
        return +d.TIME_PERIOD;
      }),
      d3.max(wideData, function (d) {
        return +d.TIME_PERIOD;
      }),
    ])
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(2).tickFormat(d3.format("d")));

  // Add X axis label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 35)
    .text("Year")
    .style("font-size", "12px")
    .attr("class", "label");

  //stack the data?
  var stackedData = d3.stack().offset(d3.stackOffsetNone).keys(keys)(wideData);

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      // Loop over each row's points to get the lowest and highest values
      d3.min(stackedData, (layer) => d3.min(layer, (d) => d[0])),
      d3.max(stackedData, (layer) => d3.max(layer, (d) => d[1])),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add Y axis label
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .attr("class", "label")
    .text("Nurses per 10,000 people")
    .style("font-size", "12px");

  // color palette
  var color = d3
    .scaleOrdinal()
    .domain(3)
    .range([
      "#771c31",
      "#99bdc1",
      "#2a5654",
      "#e5d1d1",
      "#8a9445",
      "#dbe0e6",
      "#d5c472",
      "#c8b2ce",
    ]);

  // create a tooltip
  var Tooltip = svg
    .append("text")
    .attr("x", 20)
    .attr("y", 0)
    .attr("class", "label")
    .style("opacity", 0)
    .style("font-size", 20);

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
    d3.selectAll(".stream-layer").style("opacity", 0.3);
    d3.select(this).style("stroke", "#771c31").style("opacity", 1);
  };
  var mousemove = function (d, i) {
    var grp = keys[i];
    Tooltip.text(grp);
  };
  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
    d3.selectAll(".stream-layer").style("opacity", 1).style("stroke", "none");
  };

  // Area generator
  var area = d3
    .area()
    .x(function (d) {
      return x(d.data.TIME_PERIOD);
    })
    .y0(function (d) {
      return y(d[0]);
    })
    .y1(function (d) {
      return y(d[1]);
    });

  // Show the areas with hover effects
  svg
    .selectAll(".stream-layer")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "stream-layer")
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr("d", area)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}
