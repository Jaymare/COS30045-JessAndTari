function init() {
  var w = 600;
  var h = 300;
  var padding = 52;

  var dataset;

  // Data should appear in dev tools
  d3.csv("data/oecd_data.csv", function (d) {
    return d;
  }).then(function (data) {
    // Create the visualisations
    createVisualization1(data);
    createVisualization2(data);
    createVisualization3(data);
    createVisualization4(data);
    createVisualization5(data);
  });
}
// Tari do:
// 1 Colour map comparing life expectancy by regions
// 2 Line and area chart of one of the metrics over time in different regions

// Jess do:
// 3 Dot and line chart with lots of metrics on the y axis, number on the x axis, and each country gets a coloured dot
// 4 Heat map (one of the table ones with lots of little squares) maybe for Australian states over time by each metric
// 5 A streamgraph of a few metrics in each country over time

// Viz 1
function createVisualization1(data) {
  dataset = data;
  // console.log("Viz 1 successfully loaded:", data);
  ("");
}

// Viz 2
function createVisualization2(data) {
  dataset = data;
  // console.log("Viz 2 successfully loaded:", data);
  ("");
}

// Viz 3
function createVisualization3(data) {
  dataset = data;
  // console.log("Viz 3 successfully loaded:", data);
  ("");
}

// Viz 4
function createVisualization4(data) {
  dataset = data;
  // console.log("Viz 4 successfully loaded:", data);
  ("");
}

// Viz 5
function createVisualization5(data) {
  var margin = { top: 20, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  dataset = data.filter(
    (d) =>
      d.MEASURE === "NURSES_P" &&
      d.TERRITORIAL_LEVEL === "TL2" &&
      d.REF_AREA.includes("AU") &&
      d.UNIT_MEASURE === "10P3HB",
  );

  // Console log to test the filters
  console.table(dataset, [
    "REF_AREA",
    "Measure",
    "Reference area",
    "TIME_PERIOD",
  ]);

  var svg = d3
    .select("#viz5")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // List of groups = header of the csv files
  var keys = data.columns.slice(1);

  //console.log("keys:", keys);

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, function (d) {
        return +d.TIME_PERIOD;
      }),
      d3.max(dataset, function (d) {
        return +d.TIME_PERIOD;
      }),
    ])
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(2));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return +d.TIME_PERIOD;
      }),
    ])

    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));
}

window.onload = init;
