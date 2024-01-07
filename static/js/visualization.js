//Declaring global variables for visibility accross the code
let danceArray = []; 
let energyArray = [];
let popularityArray = [];
let songnameArray = [];
let bodyRotation = 0; // Initial rotation for body movement
let MAPcountryArray = [];
let worldMap;

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
	d3.json(url).then(function (data) {
	// create variable for dates & find them in json
    let dates = [];
    for (j=0; j<data.length; j++){
      dates[j] = data[j].snapshot_date;
      }

    // console.log("raw dates array:", dates)
    
    const uniqueValues = getUniqueValuesWithLoop(dates);

    // console.log("How many unique dates = ",uniqueValues.length); 

    // select dropdown menu
    let selector = d3.select("#selDataset")
	// populate dropdown menu with dates
    for (let i = 0; i < uniqueValues.length; i++) {
        selector.append("option").text(uniqueValues[i]).property("value", uniqueValues[i]);  
    }

    // select first date for initialized graphs
    let firstDate = uniqueValues[0];
 
    // call make charts functions with first date
    pieChart(firstDate)
    danceChart(firstDate)
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
  
        const color = d3.scaleOrdinal().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .range(['#FDC367', '#E8A17A', '#C26F61', '#D499A0', '#D499BD', '#A774C5', '#84648B', '#524056', '#444096', '#605AD7']);
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

// create danceChart function with worldMap included
function danceChart(selectedDate){
    danceArray = [];
    energyArray = [];
    popularityArray = [];
    songnameArray = [];
    MAPcountryArray = [];
    
    bodyRotation = 0; 
    d3.json(url).then(function(data) {
        let j = 0;
        for (i=0; i<data.length; i++){
            if (data[i].snapshot_date == selectedDate){ 
                danceArray[j] = data[i].danceability
                energyArray[j] = data[i].energy
                popularityArray[j] = data[i].popularity
                songnameArray[j] = data[i].name
                MAPcountryArray[j] = data[i].country
                j+=1;
            }    
        }
    
        // Sort the daily ranks and song names in tandem
        for (let i = 0; i < danceArray.length - 1; i++) {
            for (let j = 0; j < danceArray.length - 1 - i; j++) {
                if (danceArray[j] < danceArray[j + 1]) {
                    // Swap elements if they are in the wrong order
                    const tempd = danceArray[j];
                    danceArray[j] = danceArray[j + 1];
                    danceArray[j + 1] = tempd;
  
                    const tempe = energyArray[j];
                    energyArray[j] = energyArray[j + 1];
                    energyArray[j + 1] = tempe;
  
                    const tempp = popularityArray[j];
                    popularityArray[j] = popularityArray[j + 1];
                    popularityArray[j + 1] = tempp;
  
                    const temps = songnameArray[j];
                    songnameArray[j] = songnameArray[j + 1];
                    songnameArray[j + 1] = temps;
  
                    const tempm = MAPcountryArray[j];
                    MAPcountryArray[j] = MAPcountryArray[j + 1];
                    MAPcountryArray[j + 1] = tempm;
                }
            }
        }
  
    danceArray = danceArray.slice(0,50);
    energyArray = energyArray.slice(0,50);
    popularityArray = popularityArray.slice(0,50);
    songnameArray = songnameArray.slice(0,50);
    MAPcountryArray = MAPcountryArray.slice(0,50);
    
    // worldMap creation
    // Clear the existing map before initializing a new one
    if (worldMap) {
      worldMap.remove();
    }
  
    // Initialize the map
    worldMap = L.map('worldMap').setView([15, 5], 2);
  
    // Add tile layer
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(worldMap);
  
    // Filter the countries (features) based on the ISO_A2 property matching the sliced MAPcountryArray
    var filteredFeatures = filteredGeoJSONData.features.filter(feature => {
      return feature.properties && MAPcountryArray.includes(feature.properties.ISO_A2);
    });
  
    // Load geoJSON data to create outlines of the top 50 countries
    var geojsonLayer = L.geoJSON({
      type: 'FeatureCollection',
      features: filteredFeatures
    }, {
      style: function (feature) {
        return {
          color: 'yellow',
          weight: 1,
          fillOpacity: 0.25
        };
      },
    }).addTo(worldMap);
    
    // Adding a click event listener for each feature (country)
    geojsonLayer.eachLayer(function (layer) {
      layer.on('click', function (e) {
        var countryName = e.target.feature.properties.ADMIN;
        var popupcontent = '<b style="font-size: 14px;">Country:</b><br><b style="font-size: 16px;">' + countryName + '</b>';
        L.popup().setLatLng(e.latlng).setContent(popupcontent).openOn(worldMap);
      });
    });
    bubbleChart();
    return danceArray;
  
    }); //For d3
}

    function setup() {
        createCanvas(400, 400);
    }

    
    function draw() {
    background(152, 149, 200); 

    // Draw the dancing girl based on the dance array
    drawDancingGirl(danceArray[frameCount % danceArray.length]);
    }

    function drawDancingGirl(danceValue) {
        // Draw the dancing girl based on danceValue
        let headSize = 50;
        let bodyHeight = 100;
        let skirtHeight = 30;
        let ponytailLength = 35;

        // Body movement based on danceValue
        bodyRotation = sin(danceValue * PI) * 30;

        // Head
        fill('#FFB6C1'); // Pink color for the head
        ellipse(width / 2, height / 2 - bodyHeight / 2 - headSize / 2, headSize, headSize);

        // Eyes
        fill('#000'); // Black color for the eyes
        ellipse(width / 2 - 10, height / 2 - bodyHeight / 2 - headSize / 2, 5, 5);
        ellipse(width / 2 + 10, height / 2 - bodyHeight / 2 - headSize / 2, 5, 5);

        // Smile
        noFill();
        stroke('#000');
        arc(width / 2, height / 2 - bodyHeight / 2 - headSize / 2 + 10, 20, 10, 0, PI);

        // Body with rotation
        fill('#605AD7');
        push(); // Save the current transformation state
        translate(width / 2, height / 2 - bodyHeight / 2);
        rotate(radians(bodyRotation));
  
        // Top trapezoidal part of the body
        beginShape();
        vertex(-20, 0);
        vertex(20, 0);
        vertex(15, (bodyHeight / 2));
        vertex(-15, (bodyHeight / 2));
        endShape(CLOSE);

        // Skirt (inverted trapezoid)
        beginShape();
        vertex(-30, (bodyHeight + skirtHeight));
        vertex(30, (bodyHeight + skirtHeight));
        vertex(15, (bodyHeight / 2));
        vertex(-15, (bodyHeight / 2));
        endShape(CLOSE);

        // Feet
        fill('#000');
        ellipse(15, (bodyHeight + skirtHeight + 2), 15, 15);
        ellipse(-15, (bodyHeight + skirtHeight + 2), 15, 15);

        pop();// Restore the previous transformation state

        
        // Hair with ponytails
        fill('#000'); // Black color for the hair
        let ponytailXOffset = 22;
        let ponytailYOffset = 12;
        // let ponytailSpacing = 20;

        // Left ponytail
        push(); // Save the current transformation state
        translate(width / 2 - ponytailXOffset, height / 2 - bodyHeight / 2 - headSize / 2 - ponytailYOffset); // Translate to the starting point
        rotate(radians(30)); // Rotate the canvas by -30 degrees

        rect(0, 0, 0, ponytailLength); // Draw the rectangle relative to the translated and rotated position
        ellipse(0, ponytailLength, 10, 10); // Draw the ellipse relative to the translated and rotated position

        pop(); // Restore the previous transformation state

        // Right ponytail
        let rightPonytailX = width / 2 + ponytailXOffset;
        let rightPonytailY = height / 2 - bodyHeight / 2 - headSize / 2 - ponytailYOffset;

        push(); // Save the current transformation matrix
        translate(rightPonytailX, rightPonytailY);
        rotate(radians(-30)); // Rotate the following shapes
        rect(0, 0, 0, ponytailLength);
        ellipse(0, ponytailLength, 10, 10);
        pop(); // Restore the previous transformation matrix


        // Arms (adjusting position based on danceValue)
        let armAngle = danceValue * PI / 2 - PI / 4; // Adjusting the range of motion
        stroke('#000');
        strokeWeight(5);
        line(width / 2 - 25, height / 2 - bodyHeight / 2 + 25, width / 2 - 25 + cos(armAngle) * 40, height / 2 - bodyHeight / 2 + 25 + sin(armAngle) * 40);
        line(width / 2 + 10, height / 2 - bodyHeight / 2 + 25, width / 2 + 25 + cos(-armAngle) * 40, height / 2 - bodyHeight / 2 + 25 + sin(-armAngle) * 40);
    }

    function bubbleChart(){
        console.log("danceArray:", danceArray);
        console.log("energy array:", energyArray);
        console.log("popularity array:", popularityArray);
        console.log("song names:", songnameArray);

        colorscale = [
            [0, 'rgb(253, 195, 103)'],
            [0.25, 'rgb(194, 111, 97)'],
            [0.5, 'rgb(212, 153, 160)'],
            [0.75, 'rgb(82, 64, 86)'],
            [1, 'rgb(96, 90, 215)']
        ]

        const tracebu = {
            x: danceArray,//dancebility
            y: energyArray, //energy
            mode: 'markers',
            marker: {
              size: popularityArray, //popularity
              color: danceArray,  // Assigning color based on danceArray
              colorscale: colorscale
            },
            text: songnameArray, //info like song name
            type: 'scatter'
          };
      
          const databu = [tracebu];
      
          const layoutbu = {
            margin: { t:0 },
            width: 900,
            height: 400,
            // title: "Song Information for selected Date.",
            xaxis: { title: 'Danceability' },
            yaxis: { title: 'Energy' },
            margin: { t:30 },
            showlegend: false
          };
      
          // Create the bubble chart
          Plotly.newPlot('plotbubble', databu, layoutbu);    
    }
    

// create optionChanged function and call chart functions
function optionChanged(date) {
    pieChart(date)
    danceChart(date)
};

// call init function to set initial graphs
init();
