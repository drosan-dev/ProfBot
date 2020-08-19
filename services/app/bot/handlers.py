import vk
from vk.exceptions import VkAPIError
import json
import random
from .keyboard import BotKeyboard, BotKeyboardButton, BotKeyboardButtonType, BotKeyboardButtonColor

from database import get_first_step, get_button, get_step

from server import app


def _configure_keyboard(buttons: list):
    """
    Метод конфигурирования клавиатуры по полученным из БД кнопкам
    :param buttons: [Button] - Список кнопок
    :return: BotKeyboard
    """
    buttons_matrix = []

    lines_sorted_buttons = sorted(buttons, key=lambda btn: btn.row)  # Сортировка кнопок по номеру строки

    prev_line = -1

    for button in lines_sorted_buttons:
        if button.row <= prev_line:
            continue

        line_buttons = list(filter(lambda btn: btn.row == button.row, lines_sorted_buttons))

        buttons_matrix.append([])

        columns_sorted_buttons = sorted(line_buttons, key=lambda btn: btn.column)

        for line_button in columns_sorted_buttons:
            if line_button.next_step is not None:
                buttons_matrix[-1].append(line_button)

        prev_line = button.row

    keyboard = BotKeyboard(one_time=False, inline=False)

    for buttons_line in buttons_matrix:
        keyboard.add_line()
        for button in buttons_line:
            keyboard.add_button(BotKeyboardButton(BotKeyboardButtonType(button.type), button.label,
                                                  BotKeyboardButtonColor(button.color),
                                                  json.dumps({'button_id': button.id})))

    return keyboard


class NewMessageHandler(object):
    """
    Обработчик новых сообщений, нажатий на кнопки с типом отличным от `callback`
    Attributes:
        token: str - Access токен для отправки сообщений
        api: vk.API - Обьект класса vk api для отправки сообщений
    """
    def __init__(self, token):
        self.token = token
        self.api = vk.API(vk.Session(access_token=token), v='5.122')

    def __get_next_step(self, payload):
        if payload is None:
            return None

        button_id = payload.get('button_id')
        if button_id is None:
            if payload.get('command') == 'start':
                return get_first_step()
            else:
                return None
        else:
            if button_id == -1:
                step_id = payload.get('step_id')
                if step_id is None:
                    return None

                curr_step = get_step(step_id)
                if curr_step is None:
                    return get_first_step()

                from_button = curr_step.from_button
                if from_button is None:
                    return get_first_step()

                prev_step = from_button.step
                if prev_step is None:
                    return get_first_step()

                return prev_step
            else:
                clicked_button = get_button(button_id)
                if clicked_button is None:
                    return get_first_step()

                new_step = clicked_button.next_step
                if new_step is None:
                    return get_first_step()

                return new_step

    def handle(self, data):
        """
        Обработка события
        :param data: JSON - Данные, полученные в запросе к боту от Callback API
        :return: None
        """
        app.logger.debug(json.dumps(data))

        user_id = data['object']['message']['from_id']
        payload = data['object']['message'].get('payload')

        if payload is None:
            return

        payload_data = json.loads(payload)

        new_step = self.__get_next_step(payload_data)

        if new_step is None:
            return

        new_buttons = new_step.buttons

        keyboard = _configure_keyboard(new_buttons)

        if new_step.from_button is not None:
            keyboard.add_line()
            keyboard.add_button(BotKeyboardButton(BotKeyboardButtonType.TEXT, "Назад", BotKeyboardButtonColor.DEFAULT,
                                                  json.dumps({'button_id': -1, 'step_id': new_step.id})))

        try:
            self.api.messages.send(access_token=self.token, user_id=str(user_id), message=new_step.text,
                                   keyboard=json.dumps(keyboard.get_keyboard()), random_id=random.getrandbits(64))
        except VkAPIError as e:
            app.logger.exception(e)


class JoinGroupHandler(object):
    """
    Обработчик события вступления в сообщество ВК
    Attributes:
        token: str - Access токен для отправки сообщений
        api: vk.API - Обьект класса vk api для отправки сообщений
    """
    def __init__(self, token):
        self.token = token
        self.api = vk.API(vk.Session(access_token=token), v='5.122')

    def handle(self, data):
        """
        Обработка события
        :param data: JSON - Данные, полученные в запросе к боту от Callback API
        :return: None
        """
        app.logger.debug(json.dumps(data))

        user_id = data['object']['user_id']

        first_step = get_first_step()
        step_buttons = first_step.buttons

        keyboard = _configure_keyboard(step_buttons)

        try:
            self.api.messages.send(access_token=self.token, user_id=str(user_id), message="Привет, я Профбот",
                                   keyboard=json.dumps(keyboard.get_keyboard()), random_id=random.getrandbits(64))
        except VkAPIError as e:
            app.logger.exception(e)


class EventMessageHandler(object):
    def __init__(self):
        pass

    def handle(self, data):
        pass
