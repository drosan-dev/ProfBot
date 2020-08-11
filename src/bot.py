import vk_api
from vk_api.longpoll import VkLongPoll, VkEventType
from vk_api.utils import get_random_id


class Bot(object):
    """ Главный класс бота

    Отсюда идет запуск бота

    Attributes:
        vk: Обьект класса VkApi для работы с АПИ ВК

    """
    def __init__(self, token):
        self.vk = vk_api.VkApi(token=token)

    def _write_msg(self, user_id, message):
        """

        Метод отправки сообщения пользователю

        :param user_id: id пользователя, которому нужно отправить сообщение
        :param message: Текст сообщения
        :return: None

        """
        self.vk.method('messages.send', {'user_id': user_id, 'message': message, 'random_id': get_random_id()})

    def handle_events(self):
        """

        Обработка получения сообщений

        :return: None

        """
        poll = VkLongPoll(self.vk)

        for event in poll.listen():
            if event.type == VkEventType.MESSAGE_NEW and event.to_me:
                message_text = event.text
                self._write_msg(event.user_id, "Ваше сообщение: %s" % message_text)
