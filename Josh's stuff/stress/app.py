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
    return render_template("stress_dash.html")


@app.route("/predict", methods=["POST"])
def stress_dash():
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
