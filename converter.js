$(document).ready(function(){
	$.getJSON( "data/JCantuResume.json", function(data) {

		// base csv string object
		var csv = "source,target,value";

		// iterate through json resume skill section
		for (var i = 0; i < data.skills.length; i++) {
			// iterate through keywords sub-section, append values to csv
			for (var j = 0; j < data.skills[i].keywords.length; j++) {
							csv += "\n" + data.skills[i].name + "," + 
							data.skills[i].keywords[j] + "," + 
							setSkillValue(data.skills[i].level);
			}
		}

		console.log(csv);
  });

	// set skill value numeric value from json value
  function setSkillValue(level) {
  	var skillLevelValue = "0";

		if (level === "Beginner") {
			skillLevelValue = "0.5";
		} else if (level === "Intermediate") {
			skillLevelValue = "1.5";
		} else if (level === "Advanced") {
			skillLevelValue = "2.0";
		}

		return skillLevelValue;
  }

});