import os
import sys
import asyncio

# Add parent directory to path so we can import from project root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from text_to_speech import generate_speech_file

async def main():
    text = ' '.join(sys.argv[1:]) if len(sys.argv)>1 else 'hello man'
    out = 'test_output.wav'

    # Ensure output directory exists
    dirpath = os.path.dirname(out)
    if dirpath and not os.path.exists(dirpath):
        os.makedirs(dirpath, exist_ok=True)

    print(f"Using CARTESIA_API_KEY: {bool(os.getenv('CARTESIA_API_KEY'))}")
    try:
        await generate_speech_file(text, out)
        print(f"Success: Created {out}")
    except Exception as e:
        print(f"Failed to generate speech: {e}")

if __name__ == '__main__':
    asyncio.run(main())
