import numpy as np

def process_file(data, fs, window_len, log):
    """
    data - audio data to be processed \n
    fs - frame rate \n
    window_len - length of the averaging window (the shorter it is the higher resolution
    will be achieved at the cost of more data to be returned)
    """
    signal = data
    signal_abs = np.abs(signal)
    max_amp = float(2**15)

    with np.errstate(divide='ignore'):
        dBFS = np.where(
            signal_abs > 0, 
            20 * np.log10(signal_abs/max_amp), 
            20 * np.log10(1/max_amp)
        )
    
    vdqs = []
    frames_per_window = int(fs / 1000) * window_len
    
    for window_idx in range(0, len(dBFS), frames_per_window):
        chunk = dBFS[window_idx:window_idx+frames_per_window]
        avg = np.average(chunk)
        std = np.std(chunk)
        if avg == 0:
            pdq = 0
        else:
            pdq = np.abs(std / avg)
        
        vdqs.append(pdq)

    avg_std = np.average(vdqs)

    # avg = np.average(dBFS)
    # std = np.std(dBFS)

    # quotient = abs(std/avg)

    return {
        'values': vdqs,
        'frame_length': window_len,
        'avg': float(avg_std)
    }
