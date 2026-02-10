function createVisualisation3(data) {
  var margin = { top: 40, right: 40, bottom: 100, left: 230 },
    width = 540 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  dataset = data.filter(
    (d) =>
      d.TERRITORIAL_LEVEL === "TL2" &&
      d.REF_AREA.includes("AU") &&
      d.TIME_PERIOD === "2021" &&
      d.OBS_VALUE !== "" && // Make sure there's data
      d.SEX === "_T",
  );

  var svg = d3
    .select("#viz3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}
