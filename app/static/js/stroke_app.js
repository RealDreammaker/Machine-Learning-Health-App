console.log("App Ready");

d3.select("#doCheck").on("click", (event) => doCheck(event));

d3.select("#alertOutcome").style("display", "none");

function doCheck(event) {
    d3.event.preventDefault();
    d3.select("#alertOutcome").style("display", "none");
    console.log("Checking for Results");

    var gender = d3.select("#inputGender").node().value;
    var age = d3.select("#inputAge").node().value;
    var sleepTime = d3.select("#inputSleep").node().value;
    var height = d3.select("#inputHeight").node().value;
    var weight = d3.select("#inputWeight").node().value;
    var physicalHealth = d3.select("#inputPhysicalHealth").node().value;
    var mentalHealth = d3.select("#inputMentalHealth").node().value;
    var walking = d3.select("#inputWalking").node().value;
    var asthmatic = d3.select("#inputAsthmatic").node().value;
    var smoker = d3.select("#inputSmoker").node().value;
    var alcohol = d3.select("#inputAlcohol").node().value;
    var kidneyDiesease = d3.select("#inputKidneyDiesease").node().value;
    var activity = d3.select("#inputActivity").node().value;
    var cancer = d3.select("#inputCancer").node().value;

    function calcBMI(weight,height){
        calcw = parseInt(weight);
        calch = parseInt(height);

        height_M= calch/100;

        bmi = calcw/(height_M*height_M)

        return bmi
    }

    function parseBool(string){
        if (string == 'Yes')
            return 1;
        else
            return 0
    }

    function parseGender(string){
        if (string == "Male")
            return 1;
        else
            return 0
    }


    var data = {
        "BMI": calcBMI(weight,height),
        "PhysicalHealth": parseInt(physicalHealth),
        "MentalHealth": parseFloat(mentalHealth),
        "SleepTime": parseInt(sleepTime),
        "Smoking_Yes": parseBool(smoker),
        "AlcoholDrinking_Yes": parseBool(alcohol),
        "DiffWalking_Yes": parseBool(walking),
        "Sex_Male": parseGender(gender),
        "age": age,
        "PhysicalActivity_Yes": parseBool(activity),
        "Asthma_Yes": parseBool(asthmatic),
        "KidneyDisease_Yes": parseBool(kidneyDiesease),
        "SkinCancer_Yes": parseBool(cancer),
    }

    // check for missing field values 
    console.log("sleeptime: " + sleepTime);
    
    var errorMessage = "Please enter:"; //13 characters

    if (sleepTime==""){errorMessage+= " Sleep time;" }
    if (height==""){errorMessage+= " Height;"}
    if (weight==""){errorMessage+= " Weight;"}
    if (physicalHealth==""){errorMessage+= " Physical Health;"}
    if (mentalHealth==""){errorMessage+= " Mental Health;"}

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
            "/stroke_predict", {
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


    console.log(data["age"]);  
    // error checking
    if (data["result"][0] == 1) {
        outcome = "You have a high chance of having a stroke";
        alertOutcomeDisplay.attr("class", "alert alert-success");
    } else if (data["result"][0] == 0) {
        outcome = "You should have no stroke";
        alertOutcomeDisplay.attr("class", "alert alert-info");
    }


    alertOutcomeDisplay.text(outcome);
    alertOutcomeDisplay.style("display", "block");

}