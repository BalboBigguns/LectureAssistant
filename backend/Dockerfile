FROM python:3.8-buster AS base
WORKDIR /usr/src/app
ENV PYTHONUNBUFFERED 1
RUN python -m pip install --upgrade pip
COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt && rm requirements.txt
RUN adduser --disabled-password --gecos '' --shell /bin/bash user \
    && chown -R user:user /usr/src/app
USER user

FROM base AS dev
ENV FLASK_APP app
ENV FLASK_ENV development
WORKDIR /usr/src
CMD ["flask", "run", "--host=0.0.0.0"]

FROM base AS prod
ENV FLASK_APP app
COPY ./app ./
WORKDIR /usr/src
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:create_app()", "--worker-class", "gevent"]
