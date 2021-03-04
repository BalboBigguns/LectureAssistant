import math
import numpy as np

AVERAGING_WINDOW = 10


def windowed_speech_rate(results, time, averaging_time_window=AVERAGING_WINDOW):
    """
    Returns a list of word count and its average over averaging_time_window 
    centered on a second corresponding to array index. \\
    Array indices correspond to seconds, eg.: \\
    [0] -> number of words in the 1st second.
    """
    words_each_second = [0] * (time + 1)
    for word in results:
        words_each_second[math.floor(word["start"])] += 1
    
    average_wps = []
    for idx in range(len(words_each_second)):
        first_index = 0 if idx - averaging_time_window // 2 < 0 else idx - averaging_time_window // 2
        last_index = idx + averaging_time_window // 2 + averaging_time_window % 2
        values = words_each_second[first_index: last_index]
        average_wps.append(np.average(values))
    
    return np.array(words_each_second), np.array(average_wps)

def process_transcription(words, log):
    audio_length = math.ceil(words[-1]['end'])
    log(f'Audio length: {audio_length}s')
    words_each_second, average_wps = windowed_speech_rate(words, audio_length)
    average_wpm_each_second = average_wps * 60
    word_count = len(words)
    total_wpm_average = word_count / audio_length * 60
    total_wpm_std = np.std(average_wpm_each_second)

    return {
        'words_each_second': {
            'values': words_each_second.tolist(),
            'frame_length': 1000
        },
        'average_wpm': {
            'values': average_wpm_each_second.tolist(),
            'frame_length': 1000
        },
        'words_count': word_count,
        'total_wpm_average': total_wpm_average,
        'total_wpm_std': total_wpm_std
    }
