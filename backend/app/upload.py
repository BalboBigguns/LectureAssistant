import functools
import numpy as np
import pysptk
import sys
from scipy.io import wavfile


from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, make_response
)

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

    fs, data = wavfile.read(file)

    if len(data.shape) != 1:
        return {'error': 'Incorrect number of channels'}, 400

    if fs != 16000:
        return {'error': 'Incorrect framerate'}, 400

    try:
        f0 = pysptk.rapt(data.astype(np.float32), fs=fs, hopsize=80, min=60, max=240, otype="f0")
    except:
        print('Exception rised: ')
        print(sys.exc_info())
        return {'error': 'Exception occured', 'exception': sys.exc_info()}, 500

    time = np.linspace(0., data.shape[0] / fs, np.ceil(data.shape[0] / 80).astype(np.int32)) 

    return {'f0': f0.tolist(), 'time': time.tolist(), 'std': float(np.std(f0))}, 200