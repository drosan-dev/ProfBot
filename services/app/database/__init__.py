from datetime import datetime
from .models import Step, Button, User, Role
from server import db


def get_steps_list():
    """
    Получение списка шагов бота
    :return: [Step]
    """
    return Step.query.all()


def get_step(step_id: int):
    """
    Получение шага бота по id
    :param step_id: int - ID шага
    :return: Step
    """
    return Step.query.get(step_id)


def create_step(text: str):
    """
    Добавление нового шага в БД
    :param text: str - Текст шага
    :return: Step
    """
    new_step = Step(text=text)
    new_step.created_at = datetime.utcnow()
    new_step.updated_at = datetime.utcnow()
    db.session.add(new_step)
    db.session.commit()

    return new_step


def update_step(step):
    """
    Обновление шага
    :param step: Step - Обновленный шаг
    :return: None
    """
    step.updated_at = datetime.utcnow()
    db.session.commit()


def delete_step(step_id):
    """
    Удаление шага
    :param step_id: int - ID шага
    :return: None
    """
    Step.query.filter(Step.id == step_id).delete()
    db.session.commit()


def get_first_step():
    """
    Получение первого шага бота.
    Первый шаг - шаг, на который не ведет кнопка
    :return: Step
    """
    return Step.query.filter(Step.from_button == None).first()


def create_button(button_type: str, label: str, color: str, row: int, column: int, step_id: int, to_step_id: int):
    """
    Создание кнопки
    :param button_type: str - Тип кнопки. Поддерживаемые типы см.:BotKeyboardButtonType в bot/keyboard.py
    :param label: str - Текст на кнопке
    :param color: str - Цвет кнопки. Поддерживаемые цвета см.:BotKeyboardButtonColor в bot/keyboard.py
    :param row: int - Номер строки кнопки
    :param column: int - Порядковый номер кнопки в строке
    :param step_id: int - ID шага, на котором находится кнопка
    :param to_step_id: int - ID шага, на который идет переход по кнопке
    :return: Button
    """
    button = Button()
    button.type = button_type
    button.color = color
    button.label = label
    button.row = row
    button.column = column
    button.step_id = step_id
    button.to_step_id = to_step_id

    button.created_at = datetime.utcnow()
    button.updated_at = datetime.utcnow()

    db.session.add(button)
    db.session.commit()

    return button


def get_button(button_id: int):
    """
    Получение кнопки бота по id
    :param button_id: int - ID кнопки
    :return: Button
    """
    return Button.query.get(button_id)


def update_button(button):
    """
    Обновление кнопки
    :param button: Button - Обновленная кнопка
    :return: None
    """
    button.updated_at = datetime.utcnow()
    db.session.commit()


def delete_button(button_id):
    """
    Удаление кнопки
    :param button_id: int - ID кнопки
    :return:
    """
    Button.query.filter(Button.id == button_id).delete()
    db.session.commit()


# Users
def find_user(email):
    """
    Поиск пользователя админки по email адресу
    :param email: str - Email адрес пользователя
    :return: User
    """
    return User.query.filter(User.email == email).first()


def create_user(email, password, name, surname, role_id):
    """
    Создание нового пользователя в БД
    :param email: str - Email пользователя
    :param password: str - Hash пароль пользователя
    :param name: str - Имя пользователя
    :param surname: str - Фамилия пользователя
    :param role_id: int - ID роли пользователя
    :return: User
    """
    new_user = User(email=email, password=password, name=name, surname=surname, role_id=role_id)
    new_user.created_at = datetime.utcnow()
    new_user.updated_at = datetime.utcnow()

    db.session.add(new_user)
    db.session.commit()

    return new_user


def get_users_list():
    """
    Получение списка пользователей админки
    :return: [User]
    """
    return User.query.all()


def get_user(user_id):
    """
    Получение пользователя по id
    :param user_id: int - ID пользователя
    :return: User
    """
    return User.query.get(user_id)


def delete_user(user_id):
    """
    Удаление пользователя по id
    :param user_id: int - ID пользователя
    :return: None
    """
    User.query.filter(User.id == user_id).delete()
    db.session.commit()


def update_user(user):
    """
    Обновление пользователя
    :param user: User - Пользователь с обновленными полями
    :return: None
    """
    user.updated_at = datetime.utcnow()
    db.session.commit()


# Roles
def get_role(role_id):
    """
    Получение роли по id
    :param role_id: int - ID роли
    :return: Role
    """
    return Role.query.get(role_id)
