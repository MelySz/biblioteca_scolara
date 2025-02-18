from pathlib import Path
import pymysql 
from datetime import timedelta

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
    'rest_framework',
    'rest_framework_simplejwt',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),  # Token valid 1 zi
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),  # Refresh token valid 7 zile
    "AUTH_HEADER_TYPES": ("Bearer",),
}
