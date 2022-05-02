console.log("App Ready");

d3.select("#doCheck").on("click", (event) => doCheck(event));

d3.select("#alertOutcome").style("display", "none");

function doCheck(event) {
    d3.event.preventDefault();
    d3.select("#alertOutcome").style("display", "none");
    console.log("Checking for Results");

    var age = d3.select("#inputAge").node().value;
    var annualincome = d3.select("#inputAnnualIncome").node().value;
    var FamilyMembers = d3.select("#inputFamilyMembers").node().value;
    var ChronicDiseases = d3.select("#inputChronicDiseases").node().value;
    var EmploymentType = d3.select("#inputEmploymentType").node().value;
    var GraduateOrNot = d3.select("#inputGraduateOrNot").node().value;
    var FrequentFlyer = d3.select("#inputFrequentFlyer").node().value;
    var EverTravelledAbroad = d3.select("#inputEverTravelledAbroad").node().value;
    
    function parseBool(string){
        if (string == 'Yes')
            return 1;
        else
            return 0
    }

    if (EmploymentType == "Government Sector"){
        Converted_EmploymentType = 1
    }
    else {
        Converted_EmploymentType = 0
    }
    
    var data = {
        "age": parseInt(age),
        "annualincome": parseInt(annualincome),
        "FamilyMembers": parseInt(FamilyMembers),
        "ChronicDiseases": parseBool(ChronicDiseases),
        "EmploymentType": Converted_EmploymentType,
        "GraduateOrNot": parseBool(GraduateOrNot),
        "FrequentFlyer": parseBool(FrequentFlyer),
        "EverTravelledAbroad": parseBool(EverTravelledAbroad),
    }

    console.log(data);

    // check for missing field values  
    var errorMessage = "Please enter:"; //13 characters

    if (age==""){errorMessage+= " Age;" }
    if (annualincome==""){errorMessage+= " Annual Income;"}
    if (FamilyMembers==""){errorMessage+= " Family Members;"}


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

    if (data["result"][0] == 1) {
        outcome = "We highly recommend you to offer this customer travel insurance product";
        alertOutcomeDisplay.attr("class", "alert alert-success");
    } else if (data["result"][0] == 0) {
        outcome = "This customer may not buy travel insurance";
        alertOutcomeDisplay.attr("class", "alert alert-info");
    }

    alertOutcomeDisplay.text(outcome);
    alertOutcomeDisplay.style("display", "block");

}