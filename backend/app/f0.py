import numpy as np
import pysptk

HOP_SIZE = 80


def process_file(data, fs, window_len):
    f0 = pysptk.rapt(data.astype(np.float32), fs=fs, hopsize=HOP_SIZE, min=60, max=240, otype="f0")
    averages = []
    adjusted_window_len = int(window_len / HOP_SIZE)
    frames_per_window = int(fs / 1000) * adjusted_window_len
    
    for window_idx in range(0, len(f0), frames_per_window):
        averages.append(float(np.average(f0[window_idx:window_idx+frames_per_window])))

    avg_std = np.std(averages)

    time = len(data) / fs
    new_fs = len(averages) / time
    new_frame_length = 1 / new_fs * 1000

    return {
        'values': averages,
        'frame_length': new_frame_length, #ms
        'std': float(avg_std)
    }
