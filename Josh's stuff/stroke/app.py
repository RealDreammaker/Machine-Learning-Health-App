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
    return render_template("index.html")

@app.route('/index.html')
def landing():
    """
    Display the main webpage where users can enter their details
    which we will then pass to the prediction endpoint
    """
    return render_template("index.html")


@app.route('/stroke_dash.html')
def stroke_dash():
    """
    Display the main webpage where users can enter their details
    which we will then pass to the prediction endpoint
    """
    return render_template("stroke_dash.html")


@app.route("/stroke_predict", methods=["POST"])
def stroke_predict():
    data_stroke = request.json

    stroke_col_order = [
        "BMI", "PhysicalHealth", "MentalHealth", "SleepTime", "Smoking_Yes",
        "AlcoholDrinking_Yes", "DiffWalking_Yes", "Sex_Male", "AgeCategory_18-24",
        "AgeCategory_25-29", "AgeCategory_30-34", "AgeCategory_35-39", "AgeCategory_40-44",
        "AgeCategory_45-49", "AgeCategory_50-54", "AgeCategory_55-59", "AgeCategory_60-64",
        "AgeCategory_65-69", "AgeCategory_70-74", "AgeCategory_75-79", "AgeCategory_80 or older",
        "PhysicalActivity_Yes", "Asthma_Yes", "KidneyDisease_Yes", "SkinCancer_Yes",
    ]

    # convert age
    data_stroke["AgeCategory_18-24"] = 0
    data_stroke["AgeCategory_25-29"] = 0
    data_stroke["AgeCategory_30-34"] = 0
    data_stroke["AgeCategory_35-39"] = 0
    data_stroke["AgeCategory_40-44"] = 0
    data_stroke["AgeCategory_45-49"] = 0
    data_stroke["AgeCategory_50-54"] = 0
    data_stroke["AgeCategory_55-59"] = 0
    data_stroke["AgeCategory_60-64"] = 0
    data_stroke["AgeCategory_65-69"] = 0
    data_stroke["AgeCategory_70-74"] = 0
    data_stroke["AgeCategory_75-79"] = 0
    data_stroke["AgeCategory_80 or older"] = 0
    
    if (data_stroke["age"] == "18-24"):
        data_stroke["AgeCategory_18-24"] = 1
    elif (data_stroke["age"] == "25-29"):
        data_stroke["AgeCategory_25-29"] = 1
    elif (data_stroke["age"] == "30-34"):
        data_stroke["AgeCategory_30-34"] = 1
    elif (data_stroke["age"] == "35-39"):
        data_stroke["AgeCategory_35-39"] = 1
    elif (data_stroke["age"] == "40-44"):
        data_stroke["AgeCategory_40-44"] = 1
    elif (data_stroke["age"] == "45-49"):
        data_stroke["AgeCategory_45-49"] = 1
    elif (data_stroke["age"] == "50-54"):
        data_stroke["AgeCategory_50-54"] = 1
    elif (data_stroke["age"] == "55-59"):
        data_stroke["AgeCategory_55-59"] = 1
    elif (data_stroke["age"] == "60-64"):
        data_stroke["AgeCategory_60-64"] = 1
    elif (data_stroke["age"] == "65-69"):
        data_stroke["AgeCategory_65-69"] = 1
    elif (data_stroke["age"] == "70-74"):
        data_stroke["AgeCategory_70-74"] = 1
    elif (data_stroke["age"] == "75-79"):
        data_stroke["AgeCategory_75-79"] = 1
    elif (data_stroke["age"] == "80 or older"):
        data_stroke["AgeCategory_80 or older"] = 1


    del data_stroke["age"]



    # create dataframe from received data_stroke
    # rename columns and sort as per the
    # order columns were trained on
    try:
        df = pd.DataFrame([data_stroke])[stroke_col_order]
    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    strokeX = df.values

    stroke_model = pickle.load(open('HealthApp\models\LRmodel_stroke_prediction','rb'))

    # convert nparray to list so we can
    # serialise as json
    stroke_result = stroke_model.predict(strokeX).tolist()

    return jsonify({"result": stroke_result})

@app.route('/stress_dash.html')
def stress_dash():
    """
    Display the main webpage where users can enter their details
    which we will then pass to the prediction endpoint
    """
    return render_template("stress_dash.html")

@app.route("/stress_predict", methods=["POST"])
def stress_predict():
    data_stress = request.json

    stress_col_order = ["Humidity", "Temperature", "Step count"]

    # create dataframe from received data
    # rename columns and sort as per the
    # order columns were trained on
    try:
        df = pd.DataFrame([data_stress])[stress_col_order]
    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    stressX = df.values

    stress_model = pickle.load(open('HealthApp\models\KNNmodel_stress_prediction','rb'))

    # convert nparray to list so we can
    # serialise as json
    stress_result = stress_model.predict(stressX).tolist()

    return jsonify({"result": stress_result})


if __name__ == '__main__':
    app.run(debug=True)
