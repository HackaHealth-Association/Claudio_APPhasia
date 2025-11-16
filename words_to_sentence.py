# words_to_sentence.py

import os
from dataclasses import dataclass
from typing import Optional, List
from openai import OpenAI

SYSTEM_PROMPT = """
You are an assistant for a physiotherapist who has aphasia and cannot form complete sentences. 
You must turn a series of keywords that he/she gives you into a single, clear instruction sentence to speak to their patients. 
Your task is to figure out what the patients’ complaints and pains are and give them instructions on what to do to investigate their problems. 
When we refer to “pain” or “it hurts,” we mean ONLY the symptoms of the patients. 
Your output must always be in German, no matter what language the input is in. 
Your task is to guess the therapist’s intention based on the input words. 
Input words may sometimes contain special characters such as (+, -); these can be used in different contexts (e.g., more, less, lift, lower …).
The symbol “!” must always be interpreted as an imperative/command, and the symbol “?” must always be interpreted as a question.
Please remember that your output should be simple sentences, not instructions for a robot or anything similar.


Numbers should only be said in German.

It is important that you only output single sentence that is intended to be set by the physiotherapist.

"""

@dataclass
class ProviderConfig:
    name: str
    base_url: Optional[str]
    api_key_env: str
    model: str


PROVIDERS = {
    # Low-cost Groq inference
    "groq_fast": ProviderConfig(
        name="groq_fast",
        base_url="https://api.groq.com/openai/v1",
        api_key_env="GROQ_API_KEY", # Get key from console.groq.com
        model="llama-3.1-8b-instant"
    ),

    # Native OpenAI
    "openai": ProviderConfig(
        name="openai",
        base_url=None,
        api_key_env="OPENAI_API_KEY",
        model="gpt-4.1-mini",
    ),
    # Grok / xAI
    "xai_grok": ProviderConfig(
        name="xai_grok",
        base_url="https://api.x.ai/v1",
        api_key_env="XAI_API_KEY",
        model="grok-4-fast",
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
        """
        Provider is chosen by:
        - explicit provider_name argument, or
        - LLM_PROVIDER env var, or
        - default: "groq_fast"
        """
        provider_name = provider_name or os.getenv("LLM_PROVIDER", "groq_fast")

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

        # All providers use the OpenAI-compatible client
        self.client = OpenAI(
            api_key=api_key,
            base_url=self.config.base_url,
        )

    def generate_sentence(self, keywords: List[str]) -> str:
        """Takes keyword list and returns exactly one sentence (German)."""
        if not keywords:
            raise ValueError("No keywords provided.")

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
        if not sentence:
            raise ValueError("Empty response from model.")
        return sentence


# --- Simple module-level API for the rest of the app --- #

_llm_client: Optional[LLMClient] = None


def _get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client


def generate_sentence_from_keywords(keywords: List[str]) -> str:
    """
    Public function used by backend:
    - Handles client creation
    - Raises ValueError if response is empty or no keywords
    """
    client = _get_llm_client()
    print(f"Sending to LLM ({client.config.name} / {client.config.model}): {', '.join(keywords)}")
    sentence = client.generate_sentence(keywords)
    print(f"Received from LLM: {sentence}")
    return sentence

"""
Change model/provider by environment variables, e.g.:

    export LLM_PROVIDER=openai   # or grok, or gemini
    export OPENAI_API_KEY=...
    export XAI_API_KEY=...
    export GEMINI_API_KEY=...

Backend code never needs to change when switching providers.
"""
