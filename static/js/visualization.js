const url = "/api/v1.0/spotify_music_data";

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data 
d3.json(url).then(function(data) {
    // Handle the initial data fetch if needed
});

// create init function
function init() {
    // read in json data
    d3.json(url).then(function(data) {
        // create variable for dates & find them in json
        let dates = [];
        for (let j = 0; j < data.length; j++) {
            dates[j] = data[j].snapshot_date;
        }

        // Creating a variable to store an array of unique dates
        const uniqueValues = getUniqueValuesWithLoop(dates);

        // selecting dropdown menu
        let selector = d3.select("#selDataset");

        // populating dropdown menu with unique dates
        for (let i = 0; i < uniqueValues.length; i++) {
            selector.append("option").text(uniqueValues[i]).property("value", uniqueValues[i]);
        }

        // selecting the first date for initialized graphs
        let firstDate = uniqueValues[0];

        // calling make charts functions with the first date
        // worldMap(firstDate)
        // barChart(firstDate)
        pieChart(firstDate)
        // danceChart(firstDate)
    });
}

// This function sifts through the dates array and 
// provides an array of unique dates
function getUniqueValuesWithLoop(inputArray) {
    const uniqueValuesSet = new Set();

    for (let i = 0; i < inputArray.length; i++) {
        uniqueValuesSet.add(inputArray[i]);
    }

    // Convert the Set back to an array
    const uniqueValuesArray = Array.from(uniqueValuesSet);

    return uniqueValuesArray;
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// create worldMap function

// create barChart function

// create pieChart function
function pieChart(selectedDate) {
    // Select the existing SVG element and remove it
    d3.select("#pieChart").select("svg").remove();
  
    // Fetch data
    d3.json(url).then(function(data) {
        // Filter data for the selected date
        const filteredData = data.filter(entry => entry.snapshot_date === selectedDate);
  
        // Count occurrences of each genre
        const genreCounts = {};
        filteredData.forEach(entry => {
            const genre = entry.genre; 
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
  
        // Sort genres based on counts in descending order
        const sortedGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);
  
        // Take the top 10 genres
        const topGenres = sortedGenres.slice(0, 10);
  
        // Create data for the pie chart
        const pieData = topGenres.map(genre => ({ genre: genre, count: genreCounts[genre] }));
  
        // Create the pie chart
        const width = 400;
        const height = 400;
  
        const svg = d3.select("#pieChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
        const color = d3.scaleOrdinal(d3.schemeBlues[9]); 
        const pie = d3.pie().value(d => d.count);
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);
  
        const arcs = svg.selectAll("path")
            .data(pie(pieData))
            .enter()
            .append("g")
            .attr("class", "arc");
  
        arcs.append("path")
            .attr("fill", d => color(d.data.genre))
            .attr("d", arc);
  
        arcs.append("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("dy", "0.35em")
            .text(d => d.data.genre)
            .style("text-anchor", "middle")
            .style("font-size", "10px");
    });
  }
  
  


// create danceChart function

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// create optionChanged function and call chart functions
function optionChanged(date) {
    // worldMap(date)
    // barChart(date)
  pieChart(date)
    // danceChart(date)
}

// call init function to set initial graphs
init();
