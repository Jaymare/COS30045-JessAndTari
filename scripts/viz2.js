const margin = { top: 40, right: 100, bottom: 50, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data/active_physicians.csv").then(data => {

  // Parse values
  data.forEach(d => {
    d.TIME_PERIOD = +d.TIME_PERIOD;
    d.OBS_VALUE = +d.OBS_VALUE;
  });

  // Filter to active physicians only
  const physicians = data.filter(d => d.MEASURE === "PHYS");

  const regions = d3.group(physicians, d => d["Reference area"]);

  const x = d3.scaleLinear()
    .domain(d3.extent(physicians, d => d.TIME_PERIOD))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([
      0,
      d3.max(physicians, d => d.OBS_VALUE)
    ])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(regions.keys())
    .range(d3.schemeTableau10);

  const line = d3.line()
    .x(d => x(d.TIME_PERIOD))
    .y(d => y(d.OBS_VALUE));

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Lines
  regions.forEach((values, region) => {
    svg.append("path")
      .datum(values)
      .attr("class", "line")
      .attr("stroke", color(region))
      .attr("d", line);
  });
  
  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width + 20}, 0)`);

  Array.from(regions.keys()).forEach((region, i) => {
    const g = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    g.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color(region));

    g.append("text")
      .attr("x", 15)
      .attr("y", 10)
      .text(region)
      .attr("font-size", "12px");
  });
});
