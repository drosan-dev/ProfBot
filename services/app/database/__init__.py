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


def add_step(text: str):
    """
    Добавление нового шага в БД
    :param text: str - Текст шага
    :return: Step
    """
    new_step = Step(text=text)
    db.session.add(new_step)
    db.session.commit()

    return new_step


def get_first_step():
    """
    Получение первого шага бота.
    Первый шаг - шаг, на который не ведет кнопка
    :return: Step
    """
    return Step.query.filter(Step.from_button == None).first()


def get_button(button_id: int):
    """
    Получение кнопки бота по id
    :param button_id: int - ID кнопки
    :return: Button
    """
    return Button.query.get(button_id)


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
