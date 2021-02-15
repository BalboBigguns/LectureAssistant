import numpy as np
import pyloudnorm as pyln

def process_file(data, fs, log):
    """
    data - audio data to be processed \n
    fs - frame rate
    """
    if np.issubdtype(data.dtype, np.integer):
        type_info = np.iinfo(data.dtype)
    else:
        type_info = np.finfo(data.dtype)

    max_amp = float(type_info.max)
    data = data / max_amp

    meter = pyln.Meter(fs) # create BS.1770 meter
    loudness = meter.integrated_loudness(data)

    return {
        'value': loudness,
    }
