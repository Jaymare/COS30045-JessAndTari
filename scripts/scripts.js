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
    createVisualisation1(data);
    createVisualisation2(data);
    createVisualisation3(data);
    createVisualisation4(data);
    createVisualisation5(data);
  });
}
// Tari do:
// 1 Colour map comparing life expectancy by regions
// 2 Line and area chart of one of the metrics over time in different regions

// These are placeholders until the visualisations are fully implemented
function createVisualisation1(data) {
  dataset = data;
  // console.log("Viz 1 successfully loaded:", data);
  ("");
}

// Viz 2
function createVisualisation2(data) {
  dataset = data;
  // console.log("Viz 2 successfully loaded:", data);
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
