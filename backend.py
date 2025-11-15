# llm_client.py
import os
from dataclasses import dataclass
from typing import Optional, List
from openai import OpenAI

SYSTEM_PROMPT = """
You are an assistant for a physiotherapist who has aphasia and cannot form full sentences.
You have to convert a set of keywords they provide into a single, clear, instructional sentence.
You must return EXACTLY 1 sentence and nothing else. It is your task to investigate what the patients
needs and pains are. When we refer to "hurt" or "pain" we ONLY refer to the patients symptoms
Your output should always be in German, no matter if the input is in English. The input words can sometimes
contain special terms like: (+,-). These may be used in a variety of contexts (like more, less , raise, lower, ...).
It is your task to understand what the context is. Please remember, that your output should be simple sentences, no
instructions for a robot or any kind.

Here are examples:
- Input: "shoulder, up, move, left"
- Output: "Bewege deine linke Schulter nach oben."

- Input: "leg, ?, hurt, right"
- Output: "Tut dein rechtes Bein weh?"

- Input: "water, please"
- Output: "Kann ich bitte etwas Wasser haben?"
"""

@dataclass
class ProviderConfig:
    name: str
    base_url: Optional[str]
    api_key_env: str
    model: str


PROVIDERS = {
    # Native OpenAI
    "openai": ProviderConfig(
        name="openai",
        base_url=None,  
        api_key_env="OPENAI_API_KEY",
        model="gpt-4.1-mini",  
    ),
    # Grok / xAI
    "grok": ProviderConfig(
        name="grok",
        base_url="https://api.x.ai/v1",
        api_key_env="XAI_API_KEY",
        model="grok-3-mini",  
    ),
    # Gemini in OpenAI-compatible mode
    "gemini": ProviderConfig(
        name="gemini",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
        api_key_env="GEMINI_API_KEY",  
        model="gemini-2.0-flash",      
    ),
}


class LLMClient:
    def __init__(self, provider_name: Optional[str] = None):
        # Choose provider from env var or default
        provider_name = provider_name or os.getenv("LLM_PROVIDER", "grok")

        if provider_name not in PROVIDERS:
            raise ValueError(
                f"Unknown LLM_PROVIDER '{provider_name}'. "
                f"Valid options: {', '.join(PROVIDERS.keys())}"
            )

        self.config = PROVIDERS[provider_name]

        api_key = os.getenv(self.config.api_key_env)
        if not api_key:
            raise ValueError(
                f"{self.config.api_key_env} not set. "
                f"Please set the environment variable for provider '{provider_name}'."
            )

        # All three providers use the OpenAI-compatible client
        self.client = OpenAI(
            api_key=api_key,
            base_url=self.config.base_url,
        )

    def generate_sentence(self, keywords: List[str]) -> str:
        """Takes keyword list and returns exactly one sentence."""
        user_prompt = "Was möchte der Physiotherapeut ausdrücken? Stichworte: "
        user_prompt += ", ".join(keywords)

        completion = self.client.chat.completions.create(
            model=self.config.model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=100,
        )

        sentence = (completion.choices[0].message.content or "").strip()
        return sentence


# backend.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS



app = Flask(__name__)
CORS(app)


llm = LLMClient()  

@app.route('/')
def index():
    return render_template('dummy.html')


@app.route('/api/generate-sentence', methods=['POST'])
def generate_sentence():
    """API endpoint to generate a sentence from keywords."""
    try:
        data = request.json or {}
        keywords = data.get('keywords', [])

        if not keywords:
            return jsonify({"error": "No keywords provided"}), 400

        sentence = llm.generate_sentence(keywords)

        if not sentence:
            return jsonify({"error": "Empty response from model"}), 500

        return jsonify({"sentence": sentence})

    except Exception as e:
        print(f"Error during generation: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)


#Change model with ...