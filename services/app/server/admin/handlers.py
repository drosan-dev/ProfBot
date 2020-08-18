import datetime
from flask import jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from .validators import LoginValidator, UserCreateValidator, UserUpdateValidator
import database


def login_handler(json):
    """
    Обработчик запроса входа
    :param json: dict - JSON данные запроса
    :return: JSON тело ответа, HTTP статус
    """

    is_valid, error = LoginValidator().is_valid(json)
    if not is_valid:
        return jsonify({'error': error}), 400

    email = json.get('email')
    password = json.get('password')

    existed_user = database.find_user(email=email)
    if existed_user is None:
        return jsonify({'error': "Bad credentials"}), 401

    if not Bcrypt().check_password_hash(existed_user.password, password):
        return jsonify({'error': "Bad credentials"}), 401

    access_token = create_access_token(identity=existed_user.id, expires_delta=datetime.timedelta(minutes=10))
    refresh_token = create_refresh_token(identity=existed_user.id, expires_delta=datetime.timedelta(days=10))

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


def refresh_handler(current_user_id):
    """
    Обработчик запроса обновления JWT токенов
    :param current_user_id: int - ID пользователя, отправившего запрос
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(current_user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    access_token = create_access_token(identity=current_user_id, expires_delta=datetime.timedelta(minutes=10))
    refresh_token = create_refresh_token(identity=current_user_id, expires_delta=datetime.timedelta(days=10))

    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


def user_create_handler(json, current_user_id):
    """
    Обработчик запроса создания нового пользователя
    :param json: dict - JSON данные запроса
    :param current_user_id: int - ID пользователя, отправившего запрос
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(current_user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401
    if current_user.role.name.lower() != 'admin':
        return jsonify({'error': 'Only admin can create users'}), 403

    is_valid, error = UserCreateValidator().is_valid(json)
    if not is_valid:
        return jsonify({'error': error}), 400

    email = json.get('email')
    password = json.get('password')
    name = json.get('name')
    surname = json.get('surname')
    role_id = json.get('role_id')

    existed_user = database.find_user(email=email)
    if existed_user is not None:
        return jsonify({'error': 'Email already taken'}), 400

    existed_role = database.get_role(role_id)
    if existed_role is None:
        return jsonify({'error': 'Role not found'}), 400

    created_user = database.create_user(email, Bcrypt().generate_password_hash(password).decode('utf-8'), name,
                                        surname, role_id)

    return jsonify(id=created_user.id, email=created_user.email, name=created_user.name, surname=created_user.surname,
                   role_name=created_user.role.name), 201


def users_list_handler(current_user_id):
    """
    Обработчик запроса получения списка пользователей
    :param current_user_id: int - ID пользователя, отправившего запрос
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(current_user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401
    if current_user.role.name.lower() != 'admin':
        return jsonify({'error': 'Only admin can get users list'}), 403

    return jsonify(list(map(lambda user: user.serialize(), database.get_users_list()))), 200


def users_retrieve_handler(user_id, current_user_id):
    """
    Обработчик запроса получения пользователя по id
    :param user_id: int - ID пользователя
    :param current_user_id: int - ID пользователя, отправившего запрос
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(current_user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401
    if current_user.role.name.lower() != 'admin' and current_user_id != user_id:
        return jsonify({'error': 'Only admin can get user info'}), 403

    if user_id == current_user_id:
        existed_user = current_user
    else:
        existed_user = database.get_user(user_id)
        if existed_user is None:
            return jsonify(error='User not found'), 404

    return jsonify(existed_user.serialize()), 200


def users_delete_handler(user_id, current_user_id):
    """
    Обрабтчик запроса удаления пользователя
    :param user_id: int - ID пользователя
    :param current_user_id: int - ID пользователя, отправившего запрос
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(current_user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401
    if current_user.role.name.lower() != 'admin':
        return jsonify({'error': 'Only admin can delete users'}), 403

    existed_user = database.get_user(user_id)
    if existed_user is None:
        return jsonify(error='User not found'), 404

    database.delete_user(user_id)

    return jsonify(None), 204


def users_update_handler(user_id, current_user_id, user_data):
    """
    Обработчик запроса обновления данных пользователя
    :param user_id: int - ID пользователя
    :param current_user_id: int - ID пользователя, отправившего запрос
    :param user_data: dict - JSON новые данные пользователя
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(current_user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401
    if current_user.role.name.lower() != 'admin' and current_user_id != user_id:
        return jsonify({'error': 'Only admin can update user info'}), 403

    if user_id == current_user_id:
        existed_user = current_user
    else:
        existed_user = database.get_user(user_id)
        if existed_user is None:
            return jsonify(error='User not found'), 404

    is_valid, error = UserUpdateValidator().is_valid(user_data)
    if not is_valid:
        return jsonify({'error': error}), 400

    new_email = user_data.get('email')
    old_password = user_data.get('old_password')
    new_password = user_data.get('new_password')
    new_name = user_data.get('name')
    new_surname = user_data.get('surname')
    new_role_id = user_data.get('role_id')

    if new_role_id is not None:
        if current_user.role.name.lower() != 'admin':
            return jsonify({'error': 'Only admin can update user role'}), 400
        existed_role = database.get_role(new_role_id)
        if existed_role is None:
            return jsonify({'error': 'Role not found'}), 400

    existed_user.email = existed_user.email if new_email is None else new_email
    existed_user.name = existed_user.name if new_name is None else new_name
    existed_user.surname = existed_user.surname if new_surname is None else new_surname
    existed_user.role_id = existed_user.role_id if new_role_id is None else new_role_id

    if old_password is not None and new_password is not None:
        if not Bcrypt().check_password_hash(existed_user.password, old_password):
            return jsonify({'error': "Wrong old password"}), 400

        existed_user.password = Bcrypt().generate_password_hash(new_password).decode('utf-8')

    database.update_user(existed_user)

    return jsonify(existed_user.serialize()), 200
