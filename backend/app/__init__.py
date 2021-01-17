import os
from flask import Flask
from flask_cors import CORS
from flask_sse import sse


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__) #, instance_relative_config=True)
    app.config["REDIS_URL"] = os.environ.get('REDIS_URL')
    app.register_blueprint(sse, url_prefix='/stream')
    CORS(app)
    # app.config.from_mapping(
    #     SECRET_KEY='dev',
    #     DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    # )

    # if test_config is None:
    #     # load the instance config, if it exists, when not testing
    #     app.config.from_pyfile('config.py', silent=True)
    # else:
    #     # load the test config if passed in
    #     app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import upload
    app.register_blueprint(upload.bp)

    return app
