$(document).ready(function(){

	// base csv string object
	var csv = "source,target,value";

	// user has uploaded json file and clicked on submit button
	$("#json-input-button").on('click', convertJson);

	// convert JSONResume file input to csv file, download to user's machine
	function convertJson(e) {
		e.preventDefault();

		// grab file value, create object URL to use in getJSON call
		var jsonFileValue = $("#json-input")[0].files[0];
		var jsonFile = window.URL.createObjectURL(jsonFileValue);

		$.getJSON(jsonFile, function(data) {

			// iterate through json resume skill section
			for (var i = 0; i < data.skills.length; i++) {
				// iterate through keywords sub-section, append values to csv
				for (var j = 0; j < data.skills[i].keywords.length; j++) {
								csv += "\n" + data.skills[i].name + "," + 
								data.skills[i].keywords[j] + "," + 
								setSkillValue(data.skills[i].level);
				}
			}

			// download
			downloadCsv(csv);
	  });
	};

	// user has uploaded converted csv file and clicked on submit button
	$("#csv-input-button").on('click', visualizeCsv);

	// hide form elements, create csv object URL from file, call D3
	function visualizeCsv(e) {
		e.preventDefault();

		//$("#json-form").hide();
		//$("#csv-form").hide();

		var csvFileValue = $("#csv-input")[0].files[0];
		var csvFile = window.URL.createObjectURL(csvFileValue);

		forceLayoutVisualize(csvFile);
	};

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
  }

  // downloads csv-converted file to local machine
  function downloadCsv(csvString) {
  	var a = document.createElement('a');
		a.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);
		a.target = '_blank';
		a.download = 'mySkills.csv';

		document.body.appendChild(a);
		a.click();
  }

});