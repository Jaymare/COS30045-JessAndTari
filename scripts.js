function init() {
  var w = 600;
  var h = 300;
  var padding = 52;

  var dataset;

  // Data should appear in dev tools
  d3.csv("data/oecd_data.csv", function (d) {}).then(function (data) {
    // Create the visualisations
    createVisualization1(data);
    // createVisualization2(data);
    // createVisualization3(data);
    // createVisualization4(data);
    // createVisualization5(data);
  });
}

function createVisualization1(data) {
  dataset = data;
  console.log("Data successfully loaded:", data);
}

window.onload = init;
