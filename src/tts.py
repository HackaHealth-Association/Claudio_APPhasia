import asyncio
from cartesia import AsyncCartesia
import os
import subprocess



client = AsyncCartesia(
    api_key="sk_car_XvGKeCDD5TTi2EoBv5K6cV"
)


async def main():
    with open("sonic-3.wav", "wb") as f:
        bytes_iter = client.tts.bytes(
            model_id="sonic-turbo",
            transcript="Rotiere deinen Arm um 90 Grad!",
            voice={
                "mode": "id",
                "id": "3264ada2-4a79-4666-badc-49e2267be692",
            },
            language="en",
            output_format={
                "container": "wav",
                "sample_rate": 44100,
                "encoding": "pcm_s16le",
            },
        )

        async for chunk in bytes_iter:
            f.write(chunk)


if __name__ == "__main__":


    asyncio.run(main())
    print("here")


    # Play the file

    subprocess.run(["ffplay", "-autoexit", "-nodisp", "sonic-3.wav"])