from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
from collections import Counter

app = Flask(__name__)
app.secret_key = 'your_secure_secret_key'  # Use a secure, unique secret key

def load_model():
    model_path = "skin_cancer_model.tflite"
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter

interpreter = load_model()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_image(image):
    try:
        image = Image.open(image.stream).convert('RGB')
        image = image.resize((64, 64))
        image_array = np.array(image)
        image_array = np.expand_dims(image_array, axis=0)
        return image_array.astype(np.float32)
    except Exception as e:
        raise ValueError(f"Failed to preprocess image: {e}")

def predict_image(image_array):
    interpreter.set_tensor(input_details[0]['index'], image_array)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    if output_data.size == 0:
        raise ValueError("Model returned empty output.")
    return np.argmax(output_data)

classes = [
    'Melanocytic nevi', 'Melanoma', 'Benign keratosis-like lesions',
    'Basal cell carcinoma', 'Actinic keratoses', 'Vascular lesions', 'Dermatofibroma'
]

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files.get('file')
        if not file or file.filename == '':
            return render_template('index.html', error="No file was uploaded or selected.")

        try:
            image_array = preprocess_image(file)
            prediction_index = predict_image(image_array)
            session['initial_prediction'] = classes[prediction_index]
            return redirect(url_for('quiz'))
        except Exception as e:
            return render_template('index.html', error=str(e))
    return render_template('index.html')

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    if request.method == 'POST':
        quiz_answers = request.form.getlist('answers')
        initial_prediction = session.get('initial_prediction', 'Unknown condition')
        combined_answers = [initial_prediction] + quiz_answers
        counter = Counter(combined_answers)
        final_diagnosis, _ = counter.most_common(1)[0]
        return render_template('result.html', diagnosis=final_diagnosis)
    return render_template('quiz.html')

@app.route('/finalize', methods=['POST'])
def finalize():
    quiz_answers = request.form.getlist('quiz_answers')
    initial_prediction = session.pop('initial_prediction', None)
    if not initial_prediction:
        return jsonify({'error': 'Initial prediction not found.'}), 400

    combined_output = [initial_prediction] + quiz_answers
    counter = Counter(combined_output)
    most_common_condition, count = counter.most_common(1)[0]
    final_diagnosis = most_common_condition if count > 1 else initial_prediction

    return render_template('result.html', diagnosis=final_diagnosis)

if __name__ == '__main__':
    app.run(debug=True)
