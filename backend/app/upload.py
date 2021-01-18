import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, make_response
)
from . import f0
from . import speechToText
from . import speechRate
from . import volume
import sys
import logging
from scipy.io import wavfile


bp = Blueprint('upload', __name__, url_prefix='/upload')

ALLOWED_EXTENSIONS = {'wav'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('', methods=['POST'])
def upload_file():
    print(request.files)
    if 'file' not in request.files:
        print('File part is missing')
        return {'error': 'File part is missing'}, 400

    file = request.files['file']

    if file.filename == '':
        print('File is missing')
        return {'error': 'File is missing'}, 400

    if not allowed_file(file.filename):
        print('Inapropriate file format')
        return {'error': 'Inapropriate file format'}, 400

    try:
        fs, data = wavfile.read(file)
        if len(data.shape) != 1:
            return {'error': 'Incorrect number of channels'}, 400

        if fs != 16000:
            return {'error': 'Incorrect framerate'}, 400

        transcription = speechToText.get_transcription(data, fs)
        rate_data = speechRate.process_transcription(transcription)
        f0_data = f0.process_file(data, fs, 200)
        volume_data = volume.process_file(data, fs, 200)
    except:
        logging.exception('Exception rised: ')

        return {'error': 'Exception occured', 'exception': str(sys.exc_info()[1])}, 500
    

    response = {}
    response.update({'f0': f0_data})
    response.update({'volume': volume_data})
    response.update({'rate': rate_data})
    response.update({'transcription': transcription})

    return response, 200