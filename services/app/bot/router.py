from enum import Enum
from .handlers import NewMessageHandler, JoinGroupHandler, EventMessageHandler


class BotEventType(Enum):
    """
    Перечисление обрабатываемых ботом событий
    """

    # Пользователь вступил в группу
    GROUP_JOIN = "group_join"

    # Пользователь нажал на callback кнопку
    MESSAGE_EVENT = "message_event"

    # Пользователь отправил сообщение или нажал на кнопку
    MESSAGE_NEW = "message_new"


class Router(object):
    """
    Маршрутизатор запросов

    Attributes:
         token: str - Access токен сервера

    """
    def __init__(self, token):
        self.token = token

    def __get_handler(self, event_type):
        """

        Метод для получения нужного обработчика по типу события

        :param event_type: BotEventType - Тип обрабатываемого события
        :return: Обработчик запроса

        """
        if event_type == BotEventType.MESSAGE_NEW:
            return NewMessageHandler(self.token)
        elif event_type == BotEventType.MESSAGE_EVENT:
            return EventMessageHandler()
        elif event_type == BotEventType.GROUP_JOIN:
            return JoinGroupHandler(self.token)
        else:
            return None

    def route(self, data):
        """

        Маршрутизация запроса
        :param data: JSON - Переданные в запросе данные
        :return: None

        """
        event_type = BotEventType(data['type'])

        handler = self.__get_handler(event_type)

        if handler is not None:
            handler.handle(data)
