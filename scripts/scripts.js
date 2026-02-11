// scripts.js - CORRECTED VERSION
function init() {
    // Load and process data once for all visualizations
    d3.csv("data/oecd_data.csv", d3.autoType).then(function(data) {
        console.log("Data loaded, rows:", data.length);
        
        // Process data for visualizations
        const processedData = {
            raw: data,
            filtered: data.filter(d => d.REF_AREA && d.OBS_VALUE),
            regions: [...new Set(data.map(d => d.REF_AREA))].filter(r => r.includes("AU"))
        };
        
        // Create visualizations with processed data
        createVisualisation1(processedData);
        createVisualisation2(processedData);
        createVisualisation3(processedData);
        createVisualisation4(processedData);
        createVisualisation5(processedData);
    }).catch(function(error) {
        console.error("Error loading data:", error);
        // Fallback to sample data if CSV fails
        createVisualisation1(getSampleData());
        createVisualisation2(getSampleData());
    });
}

// Visualization 1: Life Expectancy Map
function createVisualisation1(data) {
    const container = d3.select("#viz1");
    if (container.empty()) {
        console.error("Viz1: #viz1 container not found");
        return;
    }
    
    const width = 800;
    const height = 500;
    const margin = {top: 20, right: 20, bottom: 30, left: 50};
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
    
    // Filter for life expectancy data
    const lifeExpData = data.filtered.filter(d => 
        d.MEASURE === "LFEXP" && 
        d.TIME_PERIOD === "2022" &&
        d.SEX === "_T"
    );
    
    // Your D3 visualization code here
    console.log("Viz1: Creating life expectancy map with", lifeExpData.length, "data points");
}

// Visualization 2: Physicians Line Chart
function createVisualisation2(data) {
    const container = d3.select("#viz2");
    if (container.empty()) {
        console.error("Viz2: #viz2 container not found");
        return;
    }
    
    const width = 800;
    const height = 500;
    
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Filter for physicians data
    const physiciansData = data.filtered.filter(d => 
        d.MEASURE === "DOC" &&
        d.TERRITORIAL_LEVEL === "TL2"
    );
    
    console.log("Viz2: Creating physicians chart with", physiciansData.length, "data points");
}

// Visualization 3, 4, 5 - Add your implementations
function createVisualisation3(data) {
    const container = d3.select("#viz3");
    if (container.empty()) return;
    
    console.log("Viz3: Ready for implementation");
}

function createVisualisation4(data) {
    const container = d3.select("#viz4");
    if (container.empty()) return;
    
    console.log("Viz4: Ready for implementation");
}

function createVisualisation5(data) {
    const container = d3.select("#viz5");
    if (container.empty()) return;
    
    console.log("Viz5: Ready for implementation");
}

// Data transformation helper
function longToWide(dataset, groupByKey, categoryKey, valueKey) {
    const groupedData = {};
    
    dataset.forEach(row => {
        const key = row[groupByKey];
        if (!groupedData[key]) {
            groupedData[key] = {};
        }
        groupedData[key][row[categoryKey]] = +row[valueKey];
    });
    
    return Object.keys(groupedData).map(key => {
        return {[groupByKey]: key, ...groupedData[key]};
    });
}

// Fallback sample data if CSV fails
function getSampleData() {
    return {
        filtered: [],
        regions: ["AU1", "AU2", "AU3", "AU4", "AU5", "AU6", "AU7", "AU8"],
        raw: []
    };
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
