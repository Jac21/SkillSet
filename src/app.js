// base csv string object
let csv = "source,target,value";

// error area declaration
let errorArea = document.getElementById("error-area");

// convert JSONResume file input to csv file, download to user's machine
const convertJson = function (e) {
  e.preventDefault();

  // grab file value, create object URL to use in getJSON call
  let jsonFileValue = document.getElementById("json-input").files[0];
  let jsonFile = window.URL.createObjectURL(jsonFileValue);

  // if browser supports fetch api
  if (self.fetch) {
    fetch(jsonFile)
      .then(function (response) {
        return response.json().then(function (json) {
          // iterate through json resume skill section
          for (var i = 0; i < json.skills.length; i++) {
            // iterate through keywords sub-section, append values to csv
            for (var j = 0; j < json.skills[i].keywords.length; j++) {
              csv +=
                "\n" +
                json.skills[i].name +
                "," +
                json.skills[i].keywords[j] +
                "," +
                setSkillValue(json.skills[i].level);
            }
          }
          // clear error area and visualize
          errorArea.innerHTML = "";

          forceLayoutVisualize(
            "data:attachment/csv," + encodeURIComponent(csv)
          );
        });
      })
      .catch(function (error) {
        errorArea.innerHTML =
          "<strong>There has been a problem with your fetch operation: " +
          error.message +
          "</strong>";
      });
  } else {
    errorArea.innerHTML =
      "<strong> Your browser does not support the fetch API! Please try this once more in Chrome or Firefox.</strong>";
  }
};

/* 
	Event Handlers
*/

// user has uploaded json file and clicked on submit button
document
  .getElementById("json-input-button")
  .addEventListener("click", convertJson, false);

/* 
	Helper Functions
*/

// set skill value numeric value from json value
const setSkillValue = function (level) {
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
