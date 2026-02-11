const width = 700;
const height = 400;

const container = d3.select("#viz1"); // Changed from #chart
if (container.empty()) return;

const svg = container.append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data/OECD_health_data.csv").then((data) => {
  const lifeExp = data.filter(
    (d) => d.MEASURE === "LFEXP" && d.OBS_VALUE !== "" // Changed to LFEXP
  );

  lifeExp.forEach((d) => {
    d.OBS_VALUE = +d.OBS_VALUE;
  });

  const colorScale = d3.scaleSequential()
    .domain(d3.extent(lifeExp, (d) => d.OBS_VALUE))
    .interpolator(d3.interpolateBlues);

  const regions = lifeExp.map(d => d["Reference area"]);
  const xScale = d3.scaleBand()
    .domain(regions)
    .range([0, width])
    .padding(0.1);

  svg.selectAll("rect")
    .data(lifeExp)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d["Reference area"]))
    .attr("y", 0)
    .attr("width", xScale.bandwidth())
    .attr("height", 50)
    .attr("fill", d => colorScale(d.OBS_VALUE))
    .on("mouseover", (event, d) => {
      tooltip.style("opacity", 1)
        .html(`${d["Reference area"]}: ${d.OBS_VALUE} years`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
});
