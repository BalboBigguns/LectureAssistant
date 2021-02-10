import numpy as np
import pysptk

HOP_SIZE = 80
CHUNK_LENGTH = 10000 # 10s

def process_file(data, fs, window_len, log):
    chunk_size = int(CHUNK_LENGTH / 1000 * fs)
    pdqs = []

    for chunk in [data[idx : idx + chunk_size] for idx in range(0, len(data), chunk_size)]:
        f0 = pysptk.rapt(chunk.astype(np.float32), fs=fs, hopsize=HOP_SIZE, min=60, max=600, otype="f0")
        
        std = np.std(f0)
        avg = np.average(f0)
        
        if avg == 0:
            pdq = 0
        else:
            pdq = std / avg

        # print(f'chunk len: {len(chunk)}')
        # print(f'f0 len: {len(f0)}')
        # print(f'f0: {f0}')
        # print(f'std: {std}')
        # print(f'avg: {avg}')
        # print(f'pdq: {pdq}')

        pdqs.append(float(pdq))

    # averages = []
    # adjusted_window_len = int(window_len / HOP_SIZE)
    # frames_per_window = int(fs / 1000) * adjusted_window_len
    

    # for window_idx in range(0, len(f0), frames_per_window):
    #     averages.append(float(np.average(f0[window_idx:window_idx+frames_per_window])))

    # avg_std = np.std(averages)

    # time = len(data) / fs
    # new_fs = len(averages) / time
    # new_frame_length = 1 / new_fs * 1000

    avg_pdq = np.average(pdqs)
    log(f"Avg pitch quotient: {avg_pdq}")

    return {
        'values': pdqs,
        'frame_length': CHUNK_LENGTH, #ms
        'avg': float(avg_pdq)
    }
