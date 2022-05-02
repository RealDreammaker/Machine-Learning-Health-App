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
    
    // calculate bmi
    bmi = weight / (height/100) ** 2

    // calculate body fat  https://www.gaiam.com/blogs/discover/how-to-calculate-your-ideal-body-fat-percentage#:~:text=Men%3A-,(1.20%20x%20BMI)%20%2B%20(0.23%20x%20Age,)%20%2D%2016.2%20%3D%20Body%20Fat%20Percentage
    var bodyFat = (1.20  * bmi) + (0.23 * age) - 5.4
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

    // check for missing field values  
    var errorMessage = "Please enter:"; //13 characters

    if (age==""){errorMessage+= " Age;" }
    if (height==""){errorMessage+= " Height;"}
    if (weight==""){errorMessage+= " Weight;"}
    if (diastolic==""){errorMessage+= " Diastolic Blood Pressure;"}
    if (systolic==""){errorMessage+= " Systolic Blood Pressure;" }
    if (gripForce==""){errorMessage+= " Grip Force;"}
    if (reach==""){errorMessage+= " Sit and Reach Length;"}
    if (sitUp==""){errorMessage+= " Sit Up Count;"}
    if (jump==""){errorMessage+= " Standing Jump;"}

    console.log(errorMessage)
    console.log(data);

    if (errorMessage.length > 13) {
        var outcome = "Unknown";
        var alertOutcomeDisplay = d3.select("#alertOutcome");
        outcome = errorMessage
        alertOutcomeDisplay.attr("class", "alert alert-danger");
        alertOutcomeDisplay.text(outcome);
        alertOutcomeDisplay.style("display", "block");
    }
    
    else {
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

}



function showResult(data) {
    console.log("showResult");
    console.log(data);

    var outcome = "Unknown";
    var alertOutcomeDisplay = d3.select("#alertOutcome");
    console.log(data["result"][0]);
    if (data["result"][0] == 1) {
        outcome = "Our model indicates that you have high physical performance indicators";
        alertOutcomeDisplay.attr("class", "alert alert-success");
    } else if (data["result"][0] == 2) {
        outcome = "Our model indicates that you have moderate physical performance indicators";
        alertOutcomeDisplay.attr("class", "alert alert-info");
    } else if (data["result"][0] == 3) {
        outcome = "Our model indicates that you have low physical performance indicators";
        alertOutcomeDisplay.attr("class", "alert alert-warning");
    }
    else if (data["result"][0] == 4) {
        outcome = "Our model indicates that you have very low physical performance indicators";
        alertOutcomeDisplay.attr("class", "alert alert-danger");
    }

    alertOutcomeDisplay.text(outcome);
    alertOutcomeDisplay.style("display", "block");

}