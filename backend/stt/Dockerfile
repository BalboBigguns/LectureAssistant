FROM alphacep/kaldi-vosk-server:latest

ENV MODEL_VERSION 0.15
RUN mkdir /opt/vosk-model-en \
   && cd /opt/vosk-model-en \
   && wget -q http://alphacephei.com/vosk/models/vosk-model-small-en-us-${MODEL_VERSION}.zip \
   && unzip vosk-model-small-en-us-${MODEL_VERSION}.zip \
   && mv vosk-model-small-en-us-${MODEL_VERSION} model \
   && rm -rf vosk-model-small-en-us-${MODEL_VERSION}.zip

EXPOSE 2700
WORKDIR /opt/vosk-server/websocket
ENV VOSK_SAMPLE_RATE 16000
CMD [ "python3", "./asr_server.py", "/opt/vosk-model-en/model" ]
