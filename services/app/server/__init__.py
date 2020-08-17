import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

handler = RotatingFileHandler('app.log', maxBytes=10 * 1024 * 1024, backupCount=1)
formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
handler.setFormatter(formatter)
handler.setLevel(logging.DEBUG if os.environ.get('DEBUG').lower() == 'true' else logging.INFO)
app.logger.addHandler(handler)

db = SQLAlchemy(app)

from .routes import *
