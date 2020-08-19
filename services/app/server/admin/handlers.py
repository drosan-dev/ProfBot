import datetime
from flask import jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from .validators import LoginValidator, UserCreateValidator, UserUpdateValidator, StepCreateValidator,\
    StepUpdateValidator, ButtonCreateValidator, ButtonUpdateValidator
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


def steps_create_handler(json, user_id):
    """
    Обработчик запроса создания шага
    :param json: dict - JSON данные запроса
    :param user_id: int - ID пользователя
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    is_valid, error = StepCreateValidator().is_valid(json)
    if not is_valid:
        return jsonify({'error': error}), 400

    new_step = database.create_step(text=json.get('text'))

    buttons = json.get('buttons')

    if buttons is not None:
        for button in buttons:
            database.create_button(button_type=button['type'], label=button['label'],
                                   color=button['color'], row=button['row'], column=button['column'],
                                   step_id=new_step.id, to_step_id=button['to_step_id'])

    return jsonify(new_step.serialize()), 201


def steps_list_handler(user_id):
    """
    Обработчик запроса получения списка шагов
    :param user_id: int - ID пользователя
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    return jsonify(list(map(lambda step: step.serialize(), database.get_steps_list()))), 200


def steps_retrieve_handler(step_id, user_id):
    """
    Обработчик запроса получения шага по ID
    :param step_id: int - ID шага
    :param user_id: int - ID пользователя
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    existed_step = database.get_step(step_id)
    if existed_step is None:
        return jsonify(error='Step not found'), 404

    return jsonify(existed_step.serialize()), 200


def steps_delete_handler(step_id, user_id):
    """
    Обработчик запроса удаления шага
    :param step_id: int - ID шага
    :param user_id: int - ID пользователя
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    existed_step = database.get_step(step_id)
    if existed_step is None:
        return jsonify(error='Step not found'), 404

    database.delete_step(step_id)

    return jsonify(None), 204


def steps_update_handler(step_id, user_id, json):
    """
    Обработчик запороса обновления шага
    :param step_id: int - ID шага
    :param user_id: int - ID пользователя
    :param json: dict - JSON данные запроса
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    existed_step = database.get_step(step_id)
    if existed_step is None:
        return jsonify(error='Step not found'), 404

    is_valid, error = StepUpdateValidator().is_valid(json)
    if not is_valid:
        return jsonify({'error': error}), 400

    buttons = json.get('buttons')

    if buttons is not None:
        for button in buttons:
            button_id = button.get('id')
            if button_id is None:
                is_valid, error = ButtonCreateValidator().is_valid(button)
                if not is_valid:
                    return jsonify({'error': error}), 400

                database.create_button(button_type=button['type'], label=button['label'],
                                       color=button['color'], row=button['row'], column=button['column'],
                                       step_id=step_id, to_step_id=button['to_step_id'])
            else:
                existed_button = database.get_button(button_id)
                if existed_button is None:
                    return jsonify(error='Button not found'), 404

                is_valid, error = ButtonUpdateValidator().is_valid(button)
                if not is_valid:
                    return jsonify({'error': error}), 400

                existed_button.type = button.get('type', existed_button.type)
                existed_button.color = button.get('color', existed_button.color)
                existed_button.label = button.get('label', existed_button.label)
                existed_button.row = button.get('row', existed_button.row)
                existed_button.column = button.get('column', existed_button.column)
                existed_button.to_step_id = button.get('to_step_id', existed_button.to_step_id)

                database.update_button(existed_button)

    existed_step.text = json.get('text', existed_step.text)
    database.update_step(existed_step)

    return jsonify(existed_step.serialize()), 200


def buttons_delete_handler(button_id, user_id):
    """
    Обработчик запролса на удаление кнопки
    :param button_id: int - ID кнопки
    :param user_id: int - ID пользователя
    :return: JSON тело ответа, HTTP статус
    """
    current_user = database.get_user(user_id)
    if current_user is None:
        return jsonify({'error': 'Unauthorized'}), 401

    existed_button = database.get_button(button_id)
    if existed_button is None:
        return jsonify(error='Button not found'), 404

    database.delete_button(button_id)

    return jsonify(None), 204
