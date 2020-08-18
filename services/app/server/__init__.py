import os
import json
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import logging
from logging.handlers import RotatingFileHandler


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


# Setup app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET')

flask_bcrypt = Bcrypt(app)
jwt = JWTManager(app)

app.json_encoder = JSONEncoder

# Setup logger
handler = RotatingFileHandler('app.log', maxBytes=10 * 1024 * 1024, backupCount=1)
formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
handler.setFormatter(formatter)
handler.setLevel(logging.DEBUG if os.environ.get('DEBUG').lower() == 'true' else logging.INFO)
app.logger.addHandler(handler)

# Setup database
db = SQLAlchemy(app)

from .routes import *
