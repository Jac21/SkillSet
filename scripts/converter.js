// base csv string object
var csv = "source,target,value";

// user has uploaded json file and clicked on submit button
var submitButton = document.getElementById('json-input-button');
submitButton.addEventListener('click', convertJson, false);

// user has uploaded converted csv file and clicked on submit button
var csvInputButton = document.getElementById("csv-input-button");
csvInputButton.addEventListener('click', visualizeCsv, false);

// error area declaration
var errorArea = document.getElementById('error-area');

// convert JSONResume file input to csv file, download to user's machine
function convertJson(e) {
	e.preventDefault();

	// grab file value, create object URL to use in getJSON call
	var jsonInput = document.getElementById('json-input');
	var jsonFileValue = jsonInput.files[0];
	var jsonFile = window.URL.createObjectURL(jsonFileValue);

	// if browser supports fetch api
	if(self.fetch) {
		fetch(jsonFile)
		.then(function(response) {
			return response.json().then(function(json) {
				// iterate through json resume skill section
				for (var i = 0; i < json.skills.length; i++) {
					// iterate through keywords sub-section, append values to csv
					for (var j = 0; j < json.skills[i].keywords.length; j++) {
						csv += "\n" + json.skills[i].name + "," + 
						json.skills[i].keywords[j] + "," + 
						setSkillValue(json.skills[i].level);
					}
				}
				// clear error area
				errorArea.innerHTML = '';

				// download
				downloadCsv(csv);
			});
		})
		.catch(function(error) {
		  errorArea.innerHTML = '<strong>There has been a problem with your fetch operation: ' + error.message + '</strong>';
		});
	} else {
		errorArea.innerHTML = '<strong> Your browser does not support the fetch API! Please try this once more in Chrome or Firefox.</strong>';
	}
};

// create csv object URL from file, call D3
function visualizeCsv(e) {
	e.preventDefault();

	var csvInput = document.getElementById('csv-input');
	var csvFileValue = csvInput.files[0];
	var csvFile = window.URL.createObjectURL(csvFileValue);

	forceLayoutVisualize(csvFile);
};

/* 
	Helper Functions
*/

// set skill value numeric value from json value
function setSkillValue(level) {
	var skillLevelValue = "0";

	if (level === "Beginner") {
		skillLevelValue = "1.0";
	} else if (level === "Intermediate") {
		skillLevelValue = "2.0";
	} else if (level === "Advanced") {
		skillLevelValue = "2.5";
	}

	return skillLevelValue;
};

// downloads csv-converted file to local machine
function downloadCsv(csvString) {
	var a = document.createElement('a');
	a.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);
	a.target = '_blank';
	a.download = 'mySkills.csv';

	document.body.appendChild(a);
	a.click();
};