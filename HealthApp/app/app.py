import pandas as pd
from flask import Flask, jsonify, render_template, request
import pickle
from sklearn.preprocessing import StandardScaler
import pathlib

app = Flask(__name__)

@app.route('/')
def index():
    """
    Display the main webpage where users can select a model
    they would like to use
    """
    return render_template("index.html")

@app.route('/index.html')
def landing():
    """
    Returns a user to the main webpage where they can select a model
    they would like to use
    """
    return render_template("index.html")


@app.route('/stroke_dash.html')
def stroke_dash():
    """
    This page holds the Stroke Prediction Dash, which allows users to input info to predict
    the likelyhood of them experiencing a stroke, either as High or Low
    """
    return render_template("stroke_dash.html")


@app.route("/stroke_predict", methods=["POST"])
def stroke_predict():
    """
    Runs Stroke Prediction Model and returns JSON result
    """
    data_stroke = request.json

    stroke_col_order = [
        "BMI", "PhysicalHealth", "MentalHealth", "SleepTime", "Smoking_Yes",
        "AlcoholDrinking_Yes", "DiffWalking_Yes", "Sex_Male", "AgeCategory_18-24",
        "AgeCategory_25-29", "AgeCategory_30-34", "AgeCategory_35-39", "AgeCategory_40-44",
        "AgeCategory_45-49", "AgeCategory_50-54", "AgeCategory_55-59", "AgeCategory_60-64",
        "AgeCategory_65-69", "AgeCategory_70-74", "AgeCategory_75-79", "AgeCategory_80 or older",
        "PhysicalActivity_Yes", "Asthma_Yes", "KidneyDisease_Yes", "SkinCancer_Yes",
    ]

    # convert age from number to category
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

    try:
        stroke_df = pd.DataFrame([data_stroke])[stroke_col_order]
    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    strokeX = stroke_df.values
    stroke_model = pickle.load(open('HealthApp\models\LRmodel_stroke_prediction','rb'))

    stroke_result = stroke_model.predict(strokeX).tolist()

    return jsonify({"result": stroke_result})

@app.route('/stress_dash.html')
def stress_dash():
    """
    This page holds the BPhysical Stress Dash, which allows users to input info to
    define whether they experience no, low or high physical stress
    """
    return render_template("stress_dash.html")

@app.route("/stress_predict", methods=["POST"])
def stress_predict():
    """
    Runs Physical Stress Prediction Model and returns JSON result
    """

    data_stress = request.json

    stress_col_order = ["Humidity","Temperature","Step count"]

    try:
        stress_df = pd.DataFrame([data_stress])[stress_col_order]

    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    stressX = stress_df.values
    
    stress_model = pickle.load(open("HealthApp\models\KNNmodel_stress_prediction",'rb'))

    stress_result = stress_model.predict(stressX).tolist()

    return jsonify({"result": stress_result})

@app.route('/travel_insurance_dash.html')
def travel_insurance_dash():
    """
    This page holds the Travel Insurance Dash, which allows users to input info 
    and provides a reccommendation on whether or not they should purchase travel
    insurance
    """
    return render_template("travel_insurance_dash.html")

@app.route("/insurance_predict", methods=["POST"])
def insurance_predict():
    """
    Runs Travel Insurance Reccommendation Model and returns JSON result
    """
    data_insurance = request.json

    try:
        insurance_df = pd.DataFrame([data_insurance])

    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    print("- " * 50 +"DF:")
    print(insurance_df)  
    
    InsuranceA = insurance_df.values
    print("- " * 50 +"Array:")
    print(InsuranceA)
    print("- " * 50)

    insurance_model = pickle.load(open("HealthApp\models\KNNmodel_travel_insurance_prediction",'rb'))
    
    # convert nparray to list so we can
    # serialise as json
    insurance_result = insurance_model.predict(InsuranceA).tolist()

    return jsonify({"result": insurance_result})

@app.route('/body_performance_dash.html')
def bp_dash():
    """
    This page holds the Body Performance Dash, which allows users to input info to predict
    their physical ability level ranking from High to Very Low
    """
    return render_template("body_performance_dash.html")

@app.route("/bp_predict", methods=["POST"])
def bp_predict():
    """
    Runs Body Performance Prediction Model and returns JSON result
    """
    data_bp = request.json

    bp_col_order = [
        "age", "gender", "height_cm", "weight_kg", "body fat_%",
        "diastolic", "systolic", "gripForce", "sit and bend forward_cm",
        "sit-ups counts", "broad jump_cm"
    ]

    try:
        bp_df = pd.DataFrame([data_bp])[bp_col_order]

    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    bpX = bp_df.values
    
    bp_model = pickle.load(open("HealthApp\models\body_performance_prediction_lgb",'rb'))

    bp_result = bp_model.predict(bpX).tolist()

    return jsonify({"result": bp_result})

@app.route('/references.html')
def reference_dash():
    """
    Display a list of links to the datasets that we used
    """
    return render_template("references.html")


if __name__ == '__main__':
    app.run(debug=True)
