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
                "format": "email",
            },
            "password": {
                "type": "string",
                "minLength": 6,
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
                "format": "email",
            },
            "password": {
                "type": "string",
                "minLength": 6,
            },
            "name": {
                "type": "string",
                "minLength": 2,
            },
            "surname": {
                "type": "string",
                "minLength": 2,
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

    def is_valid(self, data, is_admin):
        """
        Метод для валидации запроса
        :param data: dict - JSON данные запроса
        :param is_admin: boolean - Запрос от админа или нет
        :return: (bool, str) - (True - если данные валидные, Текстовое описание ошибки)
        """
        try:
            validate(data, self.user_schema)
        except ValidationError as e:
            return False, e.message
        except SchemaError as e:
            return False, e.message

        if data.get('new_password') is not None and (not is_admin and data.get('old_password') is None):
            return False, "Old password cannot be null"

        if data.get('new_password') is None and data.get('old_password') is not None:
            return False, "New password cannot be null"

        return True, None


class StepCreateValidator(object):
    """
    Валидатор запроса на создание нового шага
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "text": {
                "type": "string"
            },
            "buttons": {
                "type": ["array", "null"],
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string"
                        },
                        "color": {
                            "type": "string"
                        },
                        "label": {
                            "type": "string"
                        },
                        "row": {
                            "type": "integer"
                        },
                        "column": {
                            "type": "integer"
                        },
                        "to_step_id": {
                            "type": ["integer", "null"]
                        }
                    },
                    "required": ["type", "color", "label", "row", "column", "to_step_id"]
                }
            }
        },
        "required": ["text"],
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


class StepUpdateValidator(object):
    """
    Валидатор запроса на обновление шага
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "text": {
                "type": "string"
            },
            "buttons": {
                "type": ["array", "null"],
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": ["integer", "null"]
                        },
                        "type": {
                            "type": "string"
                        },
                        "color": {
                            "type": "string"
                        },
                        "label": {
                            "type": "string"
                        },
                        "row": {
                            "type": "integer"
                        },
                        "column": {
                            "type": "integer"
                        },
                        "to_step_id": {
                            "type": ["integer", "null"]
                        }
                    },
                    "required": []
                }
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
        return True, None


class ButtonCreateValidator(object):
    """
    Валидатор запроса на создание кнопки
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "type": {
                "type": "string"
            },
            "color": {
                "type": "string"
            },
            "label": {
                "type": "string"
            },
            "row": {
                "type": "integer"
            },
            "column": {
                "type": "integer"
            },
            "to_step_id": {
                "type": ["integer", "null"]
            }
        },
        "required": ["type", "color", "label", "row", "column", "to_step_id"],
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


class ButtonUpdateValidator(object):
    """
    Валидатор запроса на обновление кнопки
    Attributes:
        user_schema: dict - Словарь правил для валидации запроса
    """
    user_schema = {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer"
            },
            "type": {
                "type": "string"
            },
            "color": {
                "type": "string"
            },
            "label": {
                "type": "string"
            },
            "row": {
                "type": "integer"
            },
            "column": {
                "type": "integer"
            },
            "to_step_id": {
                "type": ["integer", "null"]
            }
        },
        "required": ["id"],
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
