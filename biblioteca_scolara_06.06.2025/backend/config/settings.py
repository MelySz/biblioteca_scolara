from pathlib import Path
import pymysql 
from datetime import timedelta
from rest_framework.settings import api_settings
from corsheaders.defaults import default_headers
import os

pymysql.install_as_MySQLdb()

# Calea principală a proiectului
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: Păstrează această cheie secretă în producție!
SECRET_KEY = 'django-insecure-82bp#nadak3jkyzqvv714e2rbr6d3*n*^0g=w!%i(sr+lwzm9z'

# SECURITY WARNING: Nu activa `DEBUG=True` în producție!
DEBUG = True

ALLOWED_HOSTS = []

# Aplicații instalate
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'biblioteca_scolara',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', 
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-user-id",
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Configurare baza de date MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'biblioteca_scolara_db',
        'USER': 'root',  
        'PASSWORD': 'root', 
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# Validatori pentru parole
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Configurare limbă și fus orar
LANGUAGE_CODE = 'ro-ro'
TIME_ZONE = 'Europe/Bucharest'

USE_I18N = True
USE_TZ = True

# Configurare fișiere statice
STATIC_URL = '/static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Formate de dată și oră
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DATE_FORMAT': "%d.%m.%Y",
    'DATETIME_FORMAT': "%d.%m.%Y %H:%M:%S",
}

# Configurare JWT pentru autentificare securizată
SIMPLE_JWT = {
    'USER_ID_FIELD': 'id',  # Campul unic utilizat în JWT
    'USER_ID_CLAIM': 'user_id',  # Cum va fi identificat utilizatorul în token
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),  # Token valid 1 zi
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),  # Refresh token valid 7 zile
    "BLACKLIST_AFTER_ROTATION": True,  # Permite invalidarea tokenurilor
    "ROTATE_REFRESH_TOKENS": True,  # Generează un nou refresh token la fiecare login
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

AUTH_USER_MODEL = 'biblioteca_scolara.Utilizator'

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console':{
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',  # nivel de logging detaliat
            'propagate': True,
        },
        'django.server': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'rest_framework': {
            'handlers': ['console'],
            'level': 'DEBUG',  # activează logging-ul pentru DRF
            'propagate': True,
        },
    },
}
