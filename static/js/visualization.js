//Declaring global variables for visibility accross the code
let danceArray = []; 
let energyArray = [];
let popularityArray = [];
let songnameArray = [];
let bodyRotation = 0; // Initial rotation for body movement

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
    // worldMap(firstDate)
    // barChart(firstDate)
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

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// create worldMap function
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// create barChart function
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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
function danceChart(selectedDate){
    danceArray = [];
    energyArray = [];
    popularityArray = [];
    songnameArray = [];
    
    bodyRotation = 0; 
    d3.json(url).then(function(data) {
        let j = 0;
        for (i=0; i<data.length; i++){
            if (data[i].snapshot_date == selectedDate){ 
                danceArray[j] = data[i].danceability
                energyArray[j] = data[i].energy
                popularityArray[j] = data[i].popularity
                songnameArray[j] = data[i].name
                j+=1;
            }    
        }
    
    danceArray = danceArray.slice(0,25);
    energyArray = energyArray.slice(0,25);
    popularityArray = popularityArray.slice(0,25);
    songnameArray = songnameArray.slice(0,25);
    bubbleChart();
    return danceArray;

    }); //For d3
}
    function setup() {
        createCanvas(400, 400);
    }

    
    function draw() {
    background(152, 149, 200); //THIS MAKES THE BACKGROUND BOX OF FIG DARK/TRANSPARENT
    // HIGHER THE NUMBER, BACKGROUND IS TRANSPARENT

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

        const tracebu = {
            x: danceArray,//dancebility
            y: energyArray, //energy
            mode: 'markers',
            marker: {
              size: popularityArray, //popularity
              color: danceArray,  // Assigning color based on danceArray
              colorscale: 'Rainbow'
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
    // worldMap(date)
    // barChart(date)
    // pieChart(date)
    danceChart(date)
};

// call init function to set initial graphs
init();
