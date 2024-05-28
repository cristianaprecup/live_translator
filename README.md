# Live Speech Translation 

# Introduction
The Live Speech Translation is a web application built using Django that translates live speech from English to Romanian. \ The application leverages speech recognition and translation APIs to provide real-time translations.

## Features
- Real-time speech recognition
- Translation from English to Romanian
- User-friendly web interface
- RESTful API for integration with other applications

## Requirements
- Python 3.8+
- Django 3.2+
- JavaScript enabled browser

## Installation

### Clone the repo
`git clone https://github.com/cristianaprecup/live_translator.git \
cd live_translator`

### Install dependencies
`pip install django djangorestframework SpeechRecognition requests`

### Set up django
`python manage.py migrate \
python manage.py collectstatic`

### Running the server
`python manage.py runserver`


