import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

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
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    """Serves the dummy frontend for easy testing."""
    return render_template('dummy.html')


@app.route('/api/generate-sentence', methods=['POST'])
def generate_sentence():
    """API endpoint to generate a sentence from keywords."""
    if not model:
        return jsonify({"error": "Model is not initialized"}), 500

    try:
        data = request.json
        keywords = data.get('keywords', [])
        if not keywords:
            return jsonify({"error": "No keywords provided"}), 400

        user_prompt = ", ".join(keywords)
        print(f"Sending to Gemini: {user_prompt}")

        response = model.generate_content(
            user_prompt,
            generation_config=generation_config
        )

        try:
            sentence = response.text.strip()
            print(f"Received from Gemini: {sentence}")
            return jsonify({"sentence": sentence})

        except ValueError as e:
            # Handle cases where the response was empty or blocked
            print(f"Error: Response was empty or blocked. {e}")
            error_message = "Response blocked."
            try:
                if response.prompt_feedback and response.prompt_feedback.block_reason:
                    error_message = f"Response blocked: {response.prompt_feedback.block_reason.name}"
            except Exception:
                pass
            return jsonify({"error": error_message}), 500

    except Exception as e:
        print(f"Error during generation: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the server: python backend.py
    app.run(debug=True, port=5000)