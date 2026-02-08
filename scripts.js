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
// 3 Dot and line chart with lots of metrics on the y axis,
// number on the x axis, and each country gets a coloured dot
// 4 Heat map (one of the table ones with lots of little squares)
// maybe for Australian states over time by each metric
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

// Viz 5 helper for data cleanup
function longToWide(dataset, groupByKey, categoryKey, valueKey) {
  var wideData = [];
  var groupedData = {};

  // Group data by year
  dataset.forEach((row) => {
    var key = row[groupByKey];
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(row);
  });

  // Convert each group to wide format
  Object.keys(groupedData).forEach((year) => {
    var rowObject = { [groupByKey]: year };
    groupedData[year].forEach((row) => {
      rowObject[row[categoryKey]] = +row[valueKey];
    });
    wideData.push(rowObject);
  });

  return wideData;
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

  var wideData = longToWide(
    dataset,
    "TIME_PERIOD", // group by year
    "REF_AREA", // regions become columns
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
    .call(d3.axisBottom(x).ticks(2));

  //stack the data?
  var stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
    wideData,
  );

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

  // color palette
  var color = d3
    .scaleOrdinal()
    .domain(3)
    .range([
      "#e41a1c",
      "#377eb8",
      "#4daf4a",
      "#984ea3",
      "#ff7f00",
      "#ffff33",
      "#a65628",
      "#f781bf",
    ]);

  // Show the areas
  var paths = svg
    .selectAll(".stream-layer")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "stream-layer")
    .style("fill", function (d) {
      return color(d.key);
    })
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return x(d.data.TIME_PERIOD);
        })
        .y0(function (d) {
          return y(d[0]);
        })
        .y1(function (d) {
          return y(d[1]);
        }),
    );
}

window.onload = init;
