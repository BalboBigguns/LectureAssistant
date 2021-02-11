from vosk import Model, KaldiRecognizer, SetLogLevel
import numpy as np
import os
import websockets
import asyncio
from flask_sse import sse
import math


def process_chunk(raw_data, length, session_id):
    data = eval(raw_data)
    results = data.get('result')
    if results:
        last = results[-1]
        time = last['end']
        fraction = round((math.ceil(time) / length), 4) 

        if session_id:
            sse.publish({
                "seconds": time,
                "fraction": fraction
                },
                type=session_id
            )
        return results
    return []

async def transcribe(data, fs, session_id, log):
    checkpoint = 0
    transcription = []
    length = math.ceil(len(data) / fs);
    CHUNK_SIZE = 4000

    log("Processing audio...")
    async with websockets.connect(os.environ.get('STT_URL')) as websocket:
        for chunk_idx in range(0, len(data), CHUNK_SIZE):
            chunk = data[chunk_idx:chunk_idx+CHUNK_SIZE]
            await websocket.send(chunk.tobytes())
            transcription.extend(process_chunk(await websocket.recv(), length, session_id))
            progress = chunk_idx / len(data)
            if progress >= checkpoint:
                checkpoint += 0.2
                log(f"Processed {round(progress * 100)}%")

        await websocket.send('{"eof" : 1}')
        transcription.extend(process_chunk(await websocket.recv(), length, session_id))
        log("Finished")

    return transcription


def get_transcription(data, fs, session_id, log):
    transcription = asyncio.run(
        transcribe(data, fs, session_id, log),
    )

    return transcription