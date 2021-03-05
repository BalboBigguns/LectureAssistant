
**LIVE VIEW** :arrow_right: [Lecture Assistant live](http://ec2-35-156-46-170.eu-central-1.compute.amazonaws.com/) :arrow_left: **LIVE VIEW**
***

<img align="right" width="150" height="150" style="top: -32px;position: relative;" src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/logo.png" alt="lecture assistant logo"/>

# Welcome to Lecture Assistant!
This project is a part of my engineering thesis :mortar_board:


#### Functionality :book::microphone::chart_with_upwards_trend:	
I've created this web application, aiming to improve the quality of online learning and lectures in general. The app allows users to upload lecture recordings, extracting audio features from them and providing the graphical feedback on details connected with metrics associated with speech quality. 

#### How to run :floppy_disk::arrow_right::computer:

There shouldn't be any need for that as I have [live view of the app](http://ec2-35-156-46-170.eu-central-1.compute.amazonaws.com/) available but if you want to fiddle around with code and run it on your own machine here is what you do:

1. Make sure you have docker installed on your system:
    * docker >= 20.10.3 
    * docker-compose >= 1.26.2

2. Clone the code from this repo if you use git or download zip package:
    ```git clone https://github.com/BalboBigguns/lecture-assistant.git```

3. In the top directory of the project run:
    ```docker-compose up --build```
    It launches development environment with hot reloading and local API server.
    To spin up all containers in the background with production environment run:
    ```docker-compose -f docker-compose.prod.yml up --build --detach```
    Make sure to change the URL of API to the public address of your machine. You can find this setting in backend/Dockerfile.



#### Tech stack :wrench::pick::nut_and_bolt:

##### Frontend

<img width=32 src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/react.svg" alt="Reac log" style="position:relative;top:10px"/> - React Interface

<img width=32 src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/webassembly.svg" alt="Webassembly logo" style="position:relative;top:10px"/> - WebAssembly library for client side audio preprocessing

##### Backend

<img width=32 src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/docker.svg" alt="Docker logo" style="position:relative;top:10px"/> - Docker to ease deployment and dev/prod environments

<img width=32 src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/flask.svg" alt="Flask logo" style="position:relative;top:10px;background-color:white;"/> - Flask as a lightweight framework for a lightweight project

<img width=32 src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/nginx.svg" alt="Nginx logo" style="position:relative;top:10px"/> - Nginx servering built React App

<img width=32 src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/redis.svg" alt="Redis logo" style="position:relative;top:10px"/> - Redis cache and message broker for custom sessions and server sent events

#### Architecture :construction::pencil2::pencil:

Below I present the diagram with overview of different system parts and their interactions. The gist of it is dockerized backend deployed to the AWS cloud and React app on the frontend.

<p align="center">
    <img width="1000" src="https://raw.githubusercontent.com/BalboBigguns/lecture-assistant/main/docs/architecture_diagram.png" alt="architecture diagram"/>
</p>

