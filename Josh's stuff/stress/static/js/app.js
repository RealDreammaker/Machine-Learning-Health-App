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

    var data = {
        "Humidity": parseInt(hum),
        "Temperature": parseInt(temp),
        "Step count": parseFloat(steps),

    }

    console.log(data);

    d3.json(
        "/predict", {
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
        outcome = "Survived";
        alertOutcomeDisplay.attr("class", "alert alert-success");
    } else if (data["result"][0] == 0) {
        outcome = "Dead";
        alertOutcomeDisplay.attr("class", "alert alert-info");
    }

    alertOutcomeDisplay.text(outcome);
    alertOutcomeDisplay.style("display", "block");

}