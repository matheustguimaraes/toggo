import os

from dotenv import load_dotenv

load_dotenv()

DJANGO_SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-dev-key-change-in-production")
JWT_SIGNING_KEY = os.environ.get("JWT_SIGNING_KEY", DJANGO_SECRET_KEY)

POSTGRES_USER = os.environ.get("POSTGRES_USER")
POSTGRES_HOST = os.environ.get("POSTGRES_HOST")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT")
POSTGRES_DATABASE = os.environ.get("POSTGRES_DB")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD")

REDIS_URL = os.environ.get("REDIS_URL")
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")
