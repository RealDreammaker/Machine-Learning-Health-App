import pandas as pd
from flask import Flask, jsonify, render_template, request
from joblib import load
from model.persist import load_model

app = Flask(__name__)


@app.route('/')
def index():
    """
    Display the main webpage where users can enter their details
    which we will then pass to the prediction endpoint
    """
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    col_order = [
        "age", "sibsp", "parch", "fare", "is_female",
        "embarked_c", "embarked_q", "pclass_1", "pclass_2"
    ]

    rename_cols = {
        "age": "age",
        "numberOfSiblings": "sibsp",
        "numberOfParents": "parch",
        "fare": "fare",
    }

    # convert gender to is_female
    if (data["gender"] == "female"):
        data["is_female"] = 1
    else:
        data["is_female"] = 0

    del data["gender"]

    # convert passengerClass
    if (data["passengerClass"] == 1):
        data["pclass_1"] = 1
        data["pclass_2"] = 0
    elif (data["passengerClass"] == 2):
        data["pclass_1"] = 0
        data["pclass_2"] = 1
    elif (data["passengerClass"] == 3):
        data["pclass_1"] = 0
        data["pclass_2"] = 0

    del data["passengerClass"]

    # convert portOfEmbarkment
    if (data["portOfEmbarkment"] == "S"):
        data["embarked_c"] = 0
        data["embarked_q"] = 0
    elif (data["portOfEmbarkment"] == "C"):
        data["embarked_c"] = 1
        data["embarked_q"] = 0
    elif (data["portOfEmbarkment"] == "Q"):
        data["embarked_c"] = 0
        data["embarked_q"] = 1

    del data["portOfEmbarkment"]

    # create dataframe from received data
    # rename columns and sort as per the
    # order columns were trained on
    try:
        df = pd.DataFrame([data]).rename(columns=rename_cols)[col_order]
    except Exception as e:
        print("Error Parsing Input Data")
        print(e)
        return "Error"

    X = df.values

    model = load_model()

    # convert nparray to list so we can
    # serialise as json
    result = model.predict(X).tolist()

    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(debug=True)
