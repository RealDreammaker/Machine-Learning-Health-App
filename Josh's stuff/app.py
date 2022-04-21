import flask
import pickle# Use pickle to load in the pre-trained model.
with open(f'model/bike_model_xgboost.pkl', 'rb') as f:
    model = pickle.load(f)
    app = flask.Flask(__name__, template_folder='templates')@app.route('/')


@app.route('/', methods=['GET', 'POST'])
def main():
    if flask.request.method == 'GET':
        return(flask.render_template('main.html'))
    if flask.request.method == 'POST':
        temperature = flask.request.form['temperature']
        humidity = flask.request.form['humidity']
        windspeed = flask.request.form['windspeed']
        input_variables = pd.DataFrame([[temperature, humidity, windspeed]],
        columns=['temperature', 'humidity', 'windspeed'],dtype=float)
        prediction = model.predict(input_variables)[0]        
        return flask.render_template('main.html',
                                    original_input={'Temperature':temperature,
                                                     'Humidity':humidity,
                                                     'Windspeed':windspeed},
                                     result=prediction,
                                     )