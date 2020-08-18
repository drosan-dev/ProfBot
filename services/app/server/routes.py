import os
from flask import request, json, jsonify
from flask_jwt_extended import jwt_required, jwt_refresh_token_required, get_jwt_identity

from server import app
from bot.router import Router
from .admin.handlers import *

# Access токен, полученный в сообществе ВК
token = os.environ.get("VK_TOKEN")

# Код подтверждения сервера, полученный в сообществе ВК
confirmation_token = os.environ.get("CONFIRMATION_TOKEN")

router = Router(token)


@app.route('/', methods=['POST'])
def processing():
    try:
        data = json.loads(request.data)
    except ValueError:
        return 'denied'
    except TypeError:
        return 'denied'

    # Запрос от VK Callback API всегда содержит поле type
    if 'type' not in data.keys():
        return 'denied'

    # Подтверждение сервера
    if data['type'] == 'confirmation':
        return confirmation_token

    # Передаем запрос для обработки в роутер бота
    router.route(data)

    return 'ok'


@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    return login_handler(request.json)


@app.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    current_user_id = get_jwt_identity()
    return refresh_handler(current_user_id)


@app.route('/users', methods=['GET', 'POST'])
@jwt_required
def users():
    current_user_id = get_jwt_identity()
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({"error": "Missing JSON in request"}), 400

        return user_create_handler(request.json, current_user_id)
    elif request.method == 'GET':
        return users_list_handler(current_user_id)


@app.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required
def user(user_id):
    current_user_id = get_jwt_identity()
    if request.method == 'GET':
        return users_retrieve_handler(user_id, current_user_id)

    elif request.method == 'PUT':
        if not request.is_json:
            return jsonify({"error": "Missing JSON in request"}), 400
        return users_update_handler(user_id, current_user_id, request.json)

    elif request.method == 'DELETE':
        return users_delete_handler(user_id, current_user_id)
