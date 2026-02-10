// Viz 4
function createVisualisation4(data) {
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
    .select("#viz4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var regions = [...new Set(dataset.map((d) => d["Reference area"]))];
  var measures = [...new Set(dataset.map((d) => d.Measure))];

  var heatmapData = [];

  measures.forEach((measure) => {
    // Get all data for this measure
    var measureData = dataset.filter((d) => d.Measure === measure);

    // Find min and max values for THIS measure
    var values = measureData.map((d) => +d.OBS_VALUE);
    var min = d3.min(values);
    var max = d3.max(values);

    // Normalize each value to 0-1 scale
    measureData.forEach((d) => {
      var normalized = max - min > 0 ? (+d.OBS_VALUE - min) / (max - min) : 0.5;

      heatmapData.push({
        region: d["Reference area"],
        measure: measure,
        value: +d.OBS_VALUE,
        normalizedValue: normalized,
      });
    });
  });

  // Create scales
  var x = d3
    .scaleBand()
    .domain(regions) // Input: region names
    .range([0, width]) // Output: pixel positions
    .padding(0.05); // 5% gap between cells

  var y = d3.scaleBand().domain(measures).range([0, height]).padding(0.05);

  // Create colors
  var colorScale = d3
    .scaleOrdinal()
    .domain(d3.range(1, regions.length + 1)) // Ranks 1, 2, 3, etc.
    .range([
      "#f7fbff",
      "#deebf7",
      "#c6dbef",
      "#9ecae1",
      "#6baed6",
      "#4292c6",
      "#2171b5",
      "#084594",
    ]);

  svg
    .selectAll("rect")
    .data(heatmapData)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.region))
    .attr("y", (d) => y(d.measure))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", (d) => colorScale(d.normalizedValue))
    .style("stroke", "#fff")
    .style("stroke-width", 1);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g").call(d3.axisLeft(y));

  var tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "#222")
    .style("color", "#fff")
    .style("padding", "8px")
    .style("opacity", 0);

  svg
    .selectAll("rect")
    .on("mouseover", function (d) {
      tooltip
        .style("opacity", 1)
        .html(d.region + "<br/>" + d.measure + "<br/>" + d.value);
    })
    .on("mousemove", function () {
      tooltip
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 20 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });
}
