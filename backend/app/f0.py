import numpy as np
import pysptk

HOP_SIZE = 80

def process_file(data, fs, window_len, log):
    chunk_size = int(window_len / 1000 * fs)
    pdqs = []

    for chunk in [data[idx : idx + chunk_size] for idx in range(0, len(data), chunk_size)]:
        f0 = pysptk.rapt(chunk.astype(np.float32), fs=fs, hopsize=HOP_SIZE, min=60, max=600, otype="f0")
        
        f0_positive = f0[f0 > 0]
        
        if f0_positive.size != 0:
            std = np.std(f0_positive)
            avg = np.average(f0_positive)

            if avg == 0:
                pdq = 0
            else:
                pdq = std / avg
        else:
            pdq = 0

        pdqs.append(float(pdq))

    avg_pdq = np.average(pdqs)
    log(f"Avg pitch quotient: {avg_pdq}")

    return {
        'values': pdqs,
        'frame_length': window_len, #ms
        'avg': float(avg_pdq)
    }
