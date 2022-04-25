import pandas as pd
from flask import Flask, jsonify, render_template, request
import pickle

app = Flask(__name__)


@app.route('/')
def index():
    """
    Display the main webpage where users can enter their details
    which we will then pass to the prediction endpoint
    """
    return render_template("stroke_dash.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    col_order = [
        "BMI", "PhysicalHealth", "MentalHealth", "SleepTime", "Smoking_Yes",
        "AlcoholDrinking_Yes", "DiffWalking_Yes", "Sex_Male", "AgeCategory_18-24",
        "AgeCategory_25-29", "AgeCategory_30-34", "AgeCategory_35-39", "AgeCategory_40-44",
        "AgeCategory_45-49", "AgeCategory_50-54", "AgeCategory_55-59", "AgeCategory_60-64",
        "AgeCategory_65-69", "AgeCategory_70-74", "AgeCategory_75-79", "AgeCategory_80 or older",
        "PhysicalActivity_Yes", "Asthma_Yes", "KidneyDisease_Yes", "SkinCancer_Yes",
    ]

    # convert age
    data["AgeCategory_18-24"] = 0
    data["AgeCategory_25-29"] = 0
    data["AgeCategory_30-34"] = 0
    data["AgeCategory_35-39"] = 0
    data["AgeCategory_40-44"] = 0
    data["AgeCategory_45-49"] = 0
    data["AgeCategory_50-54"] = 0
    data["AgeCategory_55-59"] = 0
    data["AgeCategory_60-64"] = 0
    data["AgeCategory_65-69"] = 0
    data["AgeCategory_70-74"] = 0
    data["AgeCategory_75-79"] = 0
    data["AgeCategory_80 or older"] = 0
    
    if (data["age"] == "18-24"):
        data["AgeCategory_18-24"] = 1
    elif (data["age"] == "25-29"):
        data["AgeCategory_25-29"] = 1
    elif (data["age"] == "30-34"):
        data["AgeCategory_30-34"] = 1
    elif (data["age"] == "35-39"):
        data["AgeCategory_35-39"] = 1
    elif (data["age"] == "40-44"):
        data["AgeCategory_40-44"] = 1
    elif (data["age"] == "45-49"):
        data["AgeCategory_45-49"] = 1
    elif (data["age"] == "50-54"):
        data["AgeCategory_50-54"] = 1
    elif (data["age"] == "55-59"):
        data["AgeCategory_55-59"] = 1
    elif (data["age"] == "60-64"):
        data["AgeCategory_60-64"] = 1
    elif (data["age"] == "65-69"):
        data["AgeCategory_65-69"] = 1
    elif (data["age"] == "70-74"):
        data["AgeCategory_70-74"] = 1
    elif (data["age"] == "75-79"):
        data["AgeCategory_75-79"] = 1
    elif (data["age"] == "80 or older"):
        data["AgeCategory_80 or older"] = 1


    del data["age"]



    # create dataframe from received data
    # rename columns and sort as per the
    # order columns were trained on
    try:
        df = pd.DataFrame([data])[col_order]
    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    X = df.values

    model = pickle.load(open('HealthApp\models\LRmodel_stroke_prediction','rb'))

    # convert nparray to list so we can
    # serialise as json
    result = model.predict(X).tolist()

    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(debug=True)
