#!/bin/env bash

echo 'running database migrations'
python3 manage.py migrate --noinput

echo 'loading social events'
python3 manage.py loaddata fixtures/social_events.json

echo 'deploying backend server'
python3 manage.py runserver 0.0.0.0:5000
