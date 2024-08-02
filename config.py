# config.py
# rev 0.02
import os

class Config:
    DATABASE = os.getenv('DATABASE', 'invDatabase.db')
    DEBUG = os.getenv('DEBUG', 'True').lower() in ['true', '1', 't']
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')

# Application can import Config and use it for configuration
