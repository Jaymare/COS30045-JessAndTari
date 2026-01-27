function init() {
  var w = 600;
  var h = 300;
  var padding = 52;

  var dataset;

  // Data should appear in dev tools
  d3.csv("data.csv", function (d) {}).then(function (data) {
    dataset = data;
    console.log("Data successfully loaded:", data);
  });
}

window.onload = init;
