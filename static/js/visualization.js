const url = "/api/v1.0/spotify_music_data";

// Promise Pending
const dataPromise = d3.json(url);

// Fetch the JSON data 
d3.json(url).then(function(data) {
});

// create init function
function init() {
	// read in json data
	d3.json(url).then(function (data) {
    // console.log("whole data:",data)
    // console.log("one date value", data[0].snapshot_date)
	// create variable for dates & find them in json
    let dates = [];
    for (j=0; j<data.length; j++){
      dates[j] = data[j].snapshot_date;
      }

    // console.log("raw dates array:", dates)  
          
    // Creating a variable to store array of unique dates   
    const uniqueValues = getUniqueValuesWithLoop(dates);
    // console.log("unique date array:", uniqueValues)

    // selecting dropdown menu
    let selector = d3.select("#selDataset")
	// populating dropdown menu with unique dates
    for (let i = 0; i < uniqueValues.length; i++) {
        selector.append("option").text(uniqueValues[i]).property("value", uniqueValues[i]);  
    }

   // selecting first date for initialized graphs
   let firstDate = uniqueValues[0];
 
   // calling make charts functions with first date
   // worldMap(firstDate)
   //  barChart(firstDate)
   // pieChart(firstDate)
   //  danceChart(firstDate)
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

// create danceChart function

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// create optionChanged function and call chart functions
function optionChanged(date) {
  // worldMap(date)
  // barChart(date)
  // pieChart(date)
  // danceChart(date)
};

// call init function to set initial graphs
init ();