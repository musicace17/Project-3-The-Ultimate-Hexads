// read in JSON from our flask-powered API
const url = ""

// create init function
function init() {
	// read in json data
	d3.json(url).then(function (data) {
	// create variable for dates & find them in json
    let dates = data.snapshot_date;
	// select dropdown menu
    let selector = d3.select("#selDataset")
	// populate dropdown menu with dates
    for (let i = 0; i < dates.length; i++) {
        selector.append("option").text(dates[i]).property("value", dates[i]);  
    }
	// select first date for initialized graphs
    let firstDate = dates[0];
	// call make charts functions with first date
    worldMap(firstDate)
    barChart(firstDate)
    pieChart(firstDate)
    danceChart(firstDate)
    });
}
// create worldMap function

// create barChart function

// create pieChart function

// create danceChart function

// create optionChanged function and call chart functions
function optionChanged(date) {
    worldMap(date)
    barChart(date)
    pieChart(date)
    danceChart(date)
};

// call init function to set initial graphs
init ();