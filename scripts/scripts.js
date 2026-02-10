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

// Helper function for data cleanup
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

window.onload = init;
