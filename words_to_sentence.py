def generate_sentence_from_keywords(keywords, model, generation_config):
    """
    Takes a list of keywords, a Gemini model, and a config,
    and returns a single generated sentence string.
    Raises a ValueError if the response is empty or blocked.
    """
    user_prompt = ", ".join(keywords)
    print(f"Sending to Gemini: {user_prompt}")

    response = model.generate_content(
        user_prompt,
        generation_config=generation_config
    )

    try:
        sentence = response.text.strip()
        print(f"Received from Gemini: {sentence}")
        if not sentence:
            raise ValueError("Received an empty response from model.")
        return sentence

    except ValueError as e:
        # This catches empty response.text
        print(f"Error: Response was empty or blocked. {e}")
        error_message = "Response was empty or blocked."
        try:
            if response.prompt_feedback and response.prompt_feedback.block_reason:
                error_message = f"Response blocked: {response.prompt_feedback.block_reason.name}"
        except Exception:
            pass
        # Re-raise the error so the backend can catch it
        raise ValueError(error_message)