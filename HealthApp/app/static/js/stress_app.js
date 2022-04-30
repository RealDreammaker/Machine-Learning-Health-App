console.log("App Ready");

d3.select("#doCheck").on("click", (event) => doCheck(event));

d3.select("#alertOutcome").style("display", "none");

function doCheck(event) {
    d3.event.preventDefault();
    d3.select("#alertOutcome").style("display", "none");
    console.log("Checking for Results");

    var hum = d3.select("#inputHumidity").node().value;
    var temp = d3.select("#inputTemp").node().value;
    var steps = d3.select("#inputSteps").node().value;

    // Convert the temperature from celcius to fahrenheit
    temp = (temp/5*9) + 32

    var data = {
        "Humidity": parseInt(hum),
        "Temperature": parseInt(temp),
        "Step count": parseInt(steps),
    }

    console.log(data);

    d3.json(
        "/stress_predict", {
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