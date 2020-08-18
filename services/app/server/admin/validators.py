from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError


class LoginValidator(object):
    """
    Валидатор запроса на вход в админку
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "format": "email"
            },
            "password": {
                "type": "string",
                "minLength": 6
            }
        },
        "required": ["email", "password"],
        "additionalProperties": False
    }

    def is_valid(self, data):
        """
        Метод для валидации запроса
        :param data: dict - JSON данные запроса
        :return: (bool, str) - (True - если данные валидные, Текстовое описание ошибки)
        """
        try:
            validate(data, self.user_schema)
        except ValidationError as e:
            return False, e.message
        except SchemaError as e:
            return False, e.message
        return True, None


class UserCreateValidator(object):
    """
    Валидатор запроса на создание пользователя
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "format": "email"
            },
            "password": {
                "type": "string",
                "minLength": 6
            },
            "name": {
                "type": "string",
                "minLength": 2
            },
            "surname": {
                "type": "string",
                "minLength": 2
            },
            "role_id": {
                "type": "integer"
            }
        },
        "required": ["email", "password", "name", "surname", "role_id"],
        "additionalProperties": False
    }

    def is_valid(self, data):
        """
        Метод для валидации запроса
        :param data: dict - JSON данные запроса
        :return: (bool, str) - (True - если данные валидные, Текстовое описание ошибки)
        """
        try:
            validate(data, self.user_schema)
        except ValidationError as e:
            return False, e.message
        except SchemaError as e:
            return False, e.message
        return True, None


class UserUpdateValidator(object):
    """
    Валидатор запроса на обновление данных пользователя
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "format": "email"
            },
            "old_password": {
                "type": "string",
                "minLength": 6
            },
            "new_password": {
                "type": "string",
                "minLength": 6
            },
            "name": {
                "type": "string",
                "minLength": 2
            },
            "surname": {
                "type": "string",
                "minLength": 2
            },
            "role_id": {
                "type": "integer"
            }
        },
        "required": [],
        "additionalProperties": False
    }

    def is_valid(self, data):
        """
        Метод для валидации запроса
        :param data: dict - JSON данные запроса
        :return: (bool, str) - (True - если данные валидные, Текстовое описание ошибки)
        """
        try:
            validate(data, self.user_schema)
        except ValidationError as e:
            return False, e.message
        except SchemaError as e:
            return False, e.message

        if data.get('new_password') is not None and data.get('old_password') is None:
            return False, "Old password cannot be null"

        if data.get('new_password') is None and data.get('old_password') is not None:
            return False, "New password cannot be null"

        return True, None
