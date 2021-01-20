import math

AVERAGING_WINDOW = 10


def calc_rolling_speech_rate(results, time, averaging_time_window=AVERAGING_WINDOW):
    """
    Returns a list of word count and its average over averaging_time_window 
    centered on a second corresponding to array index. \\
    Array indices correspond to seconds, eg.: \\
    [0] -> number of words in the 1st second.
    """
    words_each_second = [0] * (time + 1)
    for word in results:
        # print(f'Word start: {math.floor(word["start"])}')
        if math.floor(word["start"]) == 62:
            print("Sth's wrong")
            print(math.floor(word["start"])) 
            print(results)
        words_each_second[math.floor(word["start"])] += 1
    
    averages = []
    for idx in range(len(words_each_second)):
        start = 0 if idx - averaging_time_window // 2 < 0 else idx - averaging_time_window // 2
        values = words_each_second[start: idx + averaging_time_window // 2 + averaging_time_window % 2]
        averages.append(sum(values) / len(values))
    
    return words_each_second, averages

def process_transcription(words):
    audio_length = math.ceil(words[-1]['end'])
    print(f'Audio length: {audio_length}s')
    words_per_second, average_words_per_second = calc_rolling_speech_rate(words, audio_length)
    average_words_per_minute = list(map(lambda w: w * 60, average_words_per_second))
    word_count = len(words)
    total_wpm_avarage = word_count / audio_length * 60

    return {
        'words_each_second': {
            'values': words_per_second,
            'frame_length': 1000
        },
        'average_wpm': {
            'values': average_words_per_minute,
            'frame_length': 1000
        },
        'words_count': word_count,
        'total_wpm_avarage': total_wpm_avarage
    }
