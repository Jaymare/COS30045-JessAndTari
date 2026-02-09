const width = 700;
const height = 400;
const cols = 5;
const cellSize = 120;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("data/life_expectancy.csv").then(data => {

  // Filter to life expectancy only
  const lifeExp = data.filter(d =>
    d.MEASURE === "LIFE_EXP" &&
    d.OBS_VALUE !== ""
  );

  lifeExp.forEach(d => {
    d.OBS_VALUE = +d.OBS_VALUE;
  });

  const colorScale = d3.scaleSequential()
    .domain(d3.extent(lifeExp, d => d.OBS_VALUE))
    .interpolator(d3.interpolateBlues);

  svg.selectAll("rect")
    .data(lifeExp)
    .enter()
    .append("rect")
    .attr("class", "region")
    .attr("x", (d, i) => (i % cols) * cellSize)
    .attr("y", (d, i) => Math.floor(i / cols) * cellSize)
    .attr("width", cellSize - 10)
    .attr("height", cellSize - 10)
    .attr("fill", d => colorScale(d.OBS_VALUE))
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`
          <strong>${d["Reference area"]}</strong><br/>
          Life expectancy: ${d.OBS_VALUE} years
        `)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  svg.selectAll("text")
    .data(lifeExp)
    .enter()
    .append("text")
    .attr("x", (d, i) => (i % cols) * cellSize + 10)
    .attr("y", (d, i) => Math.floor(i / cols) * cellSize + 20)
    .text(d => d.REF_AREA)
    .attr("fill", "#000")
    .attr("font-size", "12px");
});
