function createPhysiciansChart(containerId, physiciansData) {
    const container = d3.select("#viz2");
    const containerWidth = container.node().getBoundingClientRect().width;
    
    const margin = { top: 50, right: 200, bottom: 70, left: 80 };
    const width = Math.min(containerWidth, 1200) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    const svg = container.append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const regions = Object.keys(physiciansData);
    const years = [2019, 2020, 2021];
    
    const x = d3.scaleLinear()
        .domain(d3.extent(years))
        .range([0, width]);
    
    const maxValue = d3.max(regions, region => 
        d3.max(physiciansData[region].values, d => d.count)
    );
    
    const y = d3.scaleLinear()
        .domain([0, maxValue * 1.1])
        .nice()
        .range([height, 0]);
    
    const color = d3.scaleOrdinal()
        .domain(regions)
        .range(d3.schemeCategory10);
    
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count))
        .curve(d3.curveMonotoneX);
    
    const area = d3.area()
        .x(d => x(d.year))
        .y0(height)
        .y1(d => y(d.count))
        .curve(d3.curveMonotoneX);
    
    regions.forEach(region => {
        const regionData = physiciansData[region];
        
        svg.append("path")
            .datum(regionData.values)
            .attr("class", `area area-${region}`)
            .attr("fill", color(region))
            .attr("fill-opacity", 0.3)
            .attr("d", area);
        
        svg.append("path")
            .datum(regionData.values)
            .attr("class", `line line-${region}`)
            .attr("fill", "none")
            .attr("stroke", color(region))
            .attr("stroke-width", 2.5)
            .attr("d", line);
        
        regionData.values.forEach(d => {
            svg.append("circle")
                .attr("class", `point point-${region}`)
                .attr("cx", x(d.year))
                .attr("cy", y(d.count))
                .attr("r", 4)
                .attr("fill", color(region))
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);
        });
    });
    
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
    
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d => d3.format(",")(d)));
    
    const legend = svg.append("g")
        .attr("class", "legend-box")
        .attr("transform", `translate(${width + 20}, 0)`);
    
    regions.forEach((region, i) => {
        const regionData = physiciansData[region];
        const g = legend.append("g")
            .attr("class", "legend-item")
            .attr("transform", `translate(0, ${i * 25})`)
            .style("cursor", "pointer");
        
        g.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(region));
        
        g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .style("font-size", "12px")
            .text(regionData.name);
        
        g.on("click", () => {
            const line = svg.select(`.line-${region}`);
            const currentOpacity = line.style("opacity");
            line.style("opacity", currentOpacity === "0.2" ? "1" : "0.2");
        });
    });
    
    const tooltip = d3.select("body").append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "10px")
        .style("border", "1px solid #ddd")
        .style("border-radius", "4px")
        .style("opacity", 0)
        .style("pointer-events", "none");
    
    regions.forEach(region => {
        svg.selectAll(`.point-${region}`)
            .on("mouseover", function(event, d) {
                const regionData = physiciansData[region];
                tooltip.transition().duration(200).style("opacity", 0.95);
                tooltip.html(`
                    <strong>${regionData.name}</strong><br/>
                    Year: ${d.year}<br/>
                    Physicians: ${d3.format(",")(d.count)}
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.healthData && window.healthData.physicians) {
        createPhysiciansChart("#viz2", window.healthData.physicians);
    } else {
        console.error("Physicians data not found");
    }
});
