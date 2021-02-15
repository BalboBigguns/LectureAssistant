import functools
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, make_response, current_app
)
from . import f0
from . import speechToText
from . import speechRate
from . import volume
import sys
import logging
from scipy.io import wavfile
import numpy as np
from flask_caching import Cache
import json

bp = Blueprint('upload', __name__, url_prefix='/upload')

ALLOWED_EXTENSIONS = {'wav'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/subscribe', methods=['POST', 'DELETE'])
def subscribe():
    session_origin = request.remote_addr
    parsed_body = json.loads(request.data.decode())
    session_id = parsed_body.get('id')
    print(session_id)
    print(session_origin)

    if request.method == 'POST':
        if current_app.cache.add(session_id, session_origin):
            return {'message': 'Subscribed.'}, 201
        else:
            return {'error': 'Subscription failed'}, 400
    else:
        current_app.cache.delete(session_id)
        return '', 203

@bp.route('', methods=['POST'])
def upload_file():
    print(request.files)
    session_id = request.headers['Authorization']
    session_origin = current_app.cache.get(session_id)

    if session_origin != request.remote_addr:
        print("Session origin is incorrect")
        print(f"Session origin: {session_origin}, actual origin: {request.remote_addr}")
        session_id = None

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

        log = lambda msg: print(f"{file.filename}: {msg}")

        if data.dtype is not np.dtype('int16'):
            log(f"ERROR: Incorrect bit width - {data.dtype}")
            return {'error': 'Incorrect bit width'}, 400

        transcription = speechToText.get_transcription(data, fs, session_id, log)
        rate_data = speechRate.process_transcription(transcription, log)
        f0_data = f0.process_file(data, fs, 200, log)
        volume_data = volume.process_file(data, fs, log)
    except:
        logging.exception('Exception rised: ')

        return {'error': 'Exception occured', 'exception': str(sys.exc_info()[1])}, 500
    

    response = {}
    response.update({'f0': f0_data})
    response.update({'volume': volume_data})
    response.update({'rate': rate_data})
    response.update({'transcription': transcription})

    return response, 200