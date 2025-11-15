import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import asyncio

# Import our new modules
from words_to_sentence import generate_sentence_from_keywords
from text_to_speech import generate_speech_file

# --- Configuration ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not set. Please set the environment variable.")

genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are an assistant for a physiotherapist who has aphasia and cannot form full sentences.
You have to convert a set of keywords they provide into a single, clear, instructional sentence.
You must return EXACTLY 1 sentence and nothing else.

Here are examples:
- Input: "shoulder, up, move, left"
- Output: "Move your left shoulder up."

- Input: "leg, ?, straight"
- Output: "Is your leg straight?"

- Input: "water, please"
- Output: "Can I please have some water?"
"""

# --- Model Initialization ---
try:
    generation_config = {
        "temperature": 0.2,
        "max_output_tokens": 100,
    }
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-preview-09-2025",
        system_instruction=SYSTEM_PROMPT
    )
    print("Gemini Model successfully initialized.")
except Exception as e:
    print(f"Error initializing Gemini model: {e}")
    model = None

# --- Backend Server ---
# Create a 'static' folder in your project directory for audio files
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
os.makedirs(STATIC_DIR, exist_ok=True)

app = Flask(__name__, static_folder=STATIC_DIR, template_folder='templates')
CORS(app)


@app.route('/')
def index():
    """Serves the frontend."""
    return render_template('dummy.html')


@app.route('/api/generate-sentence', methods=['POST'])
def generate_sentence_and_speech():
    """
    API endpoint to generate a sentence and its corresponding audio file.
    """
    if not model:
        return jsonify({"error": "Model is not initialized"}), 500

    try:
        data = request.json
        keywords = data.get('keywords', [])
        if not keywords:
            return jsonify({"error": "No keywords provided"}), 400

        # --- Step 1: Call Words-to-Sentence ---
        try:
            sentence = generate_sentence_from_keywords(keywords, model, generation_config)
        except Exception as e:
            # Handle errors from the Gemini module
            return jsonify({"error": str(e)}), 500

        # --- Step 2: Call Text-to-Speech ---
        # We'll give the audio file a unique name, e.g., based on hash or timestamp
        # For simplicity, we'll just use a static name.
        output_filename = "output.wav"
        output_filepath = os.path.join(app.static_folder, output_filename)

        try:
            # Run the async TTS function
            asyncio.run(generate_speech_file(sentence, output_filepath))
        except Exception as e:
            # Handle errors from the TTS module
            return jsonify({"error": f"TTS generation failed: {str(e)}"}), 500

        # --- Step 3: Return Response ---
        # Return the sentence and the URL to the audio file
        audio_url = f"/static/{output_filename}"

        return jsonify({
            "sentence": sentence,
            "audio_url": audio_url
        })

    except Exception as e:
        print(f"Error during API call: {e}")
        return jsonify({"error": str(e)}), 500


# This route is needed so the frontend can fetch the audio file
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)


if __name__ == '__main__':
    # Run the server: python backend.py
    app.run(debug=True, port=5000)