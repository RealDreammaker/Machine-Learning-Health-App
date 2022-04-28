console.log("App Ready");

d3.select("#doCheck").on("click", (event) => doCheck(event));

d3.select("#alertOutcome").style("display", "none");

function doCheck(event) {
    d3.event.preventDefault();
    d3.select("#alertOutcome").style("display", "none");
    console.log("Checking for Results");

    var age = d3.select("#inputAge").node().value;
    var gender = d3.select("#inputGender").node().value;
    var height = d3.select("#inputHeight").node().value;
    var weight = d3.select("#inputWeight").node().value;
    var bodyFat = d3.select("#inputBodyFat").node().value;
    var diastolic = d3.select("#inputDiastolic").node().value;
    var systolic = d3.select("#inputSystolic").node().value;
    var gripForce = d3.select("#inputGrip").node().value;
    var reach = d3.select("#inputReach").node().value;
    var sitUp = d3.select("#inputSitups").node().value;
    var jump = d3.select("#inputJump").node().value;

    function parseGender(string){
        if (string == "Male")
            return 1;
        else
            return 0
    }

    var data = {
        "age": parseInt(age),
        "gender": parseGender(gender),
        "height_cm": parseInt(height),
        "weight_kg": parseInt(weight),
        "body fat_%": parseFloat(bodyFat),
        "diastolic": parseInt(diastolic),
        "systolic": parseInt(systolic),
        "gripForce": parseInt(gripForce),
        "sit and bend forward_cm": parseInt(reach),
        "sit-ups counts": parseInt(sitUp),
        "broad jump_cm": parseInt(jump),
    }

    console.log(data);

    d3.json(
        "/bp_predict", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
    ).then(
        (data) => showResult(data)
    );

}

function showResult(data) {
    console.log("showResult");
    console.log(data);

    var outcome = "Unknown";
    var alertOutcomeDisplay = d3.select("#alertOutcome");

    if (data["result"][0] == 1) {
        outcome = "Our predictor indicates that you have low levels of stress";
        alertOutcomeDisplay.attr("class", "alert alert-info");
    } else if (data["result"][0] == 0) {
        outcome = "Our predictor indicates that you have have no stress";
        alertOutcomeDisplay.attr("class", "alert alert-success");
    } else if (data["result"][0] == 2) {
        outcome = "Our predictor indicates that you have have high levels of stress";
        alertOutcomeDisplay.attr("class", "alert alert-danger");
    }

    alertOutcomeDisplay.text(outcome);
    alertOutcomeDisplay.style("display", "block");

}