from cartesia import AsyncCartesia
import os

# --- IMPORTANT ---
# Set your API key in your environment variables
# export CARTESIA_API_KEY="YOUR_API_KEY"
api_key = os.getenv("CARTESIA_API_KEY")
if not api_key:
    print("Warning: CARTESIA_API_KEY not set. TTS will fail.")


async def generate_speech_file(transcript: str, output_filename: str):
    """
    Generates a .wav file from a transcript and saves it.
    """
    print(f"Generating speech for: {transcript}")
    try:

        # Initialize client at the module level
        client = AsyncCartesia(api_key=api_key)

        with open(output_filename, "wb") as f:
            bytes_iter = client.tts.bytes(
                model_id="sonic-turbo",
                transcript=transcript,
                voice={
                    "mode": "id",
                    "id": "3264ada2-4a79-4666-badc-49e2267be692",
                },
                language="en",  # Using 'en' as example, change if needed
                output_format={
                    "container": "wav",
                    "sample_rate": 44100,
                    "encoding": "pcm_s16le",
                },
            )

            async for chunk in bytes_iter:
                f.write(chunk)
        print(f"Speech file saved to: {output_filename}")

    except Exception as e:
        print(f"Error during TTS generation: {e}")
        raise e