# backend.py

import os
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import asyncio

from words_to_sentence import generate_sentence_from_keywords
from text_to_speech import generate_speech_file

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
    try:
        data = request.json or {}
        keywords = data.get('keywords', [])

        if not keywords:
            return jsonify({"error": "No keywords provided"}), 400

        # --- Step 1: Call Words-to-Sentence (LLM is handled internally) ---
        try:
            sentence = generate_sentence_from_keywords(keywords)
        except Exception as e:
            # Handle errors from the LLM module
            return jsonify({"error": str(e)}), 500

        # --- Step 2: Call Text-to-Speech ---
        output_filename = "output.wav"  # could be made unique if needed
        output_filepath = os.path.join(app.static_folder, output_filename)

        try:
            # Run the async TTS function
            asyncio.run(generate_speech_file(sentence, output_filepath))
        except Exception as e:
            # Handle errors from the TTS module
            return jsonify({"error": f"TTS generation failed: {str(e)}"}), 500

        # --- Step 3: Return Response ---
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
