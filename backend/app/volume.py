import numpy as np

def process_file(data, fs, window_len):
    """
    data - audio data to be processed \n
    fs - frame rate \n
    window_len - length of the averaging window (the shorter it is the higher resolution
    will be achieved at the cost of more data to be returned)
    """
    signal = data
    signal_abs = np.abs(signal)

    averages = []
    frames_per_window = int(fs / 1000) * window_len
    
    for window_idx in range(0, len(signal_abs), frames_per_window):
        averages.append(np.average(signal_abs[window_idx:window_idx+frames_per_window]))

    avg_std = np.std(averages)

    return {
        'values': averages,
        'frame_length': window_len,
        'std': float(avg_std)
    }
