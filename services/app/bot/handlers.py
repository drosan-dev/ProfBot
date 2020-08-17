import vk
from vk.exceptions import VkAPIError
import json
import random
from .keyboard import BotKeyboard, BotKeyboardButton, BotKeyboardButtonType, BotKeyboardButtonColor

from database import get_first_step, get_button, get_step

from server import app


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
        button_id = payload_data.get('button_id')

        if button_id is None:
            if payload_data.get('command') == 'start':
                new_step = get_first_step()
            else:
                return
        else:
            if button_id == -1:
                step_id = payload_data.get('step_id')
                if step_id is None:
                    return

                prev_step = get_step(step_id).from_button.step
                new_step = prev_step
            else:
                clicked_button = get_button(button_id)
                new_step = clicked_button.next_step

        new_buttons = new_step.buttons

        buttons_matrix = []

        lines_sorted_buttons = sorted(new_buttons, key=lambda btn: btn.row)  # Сортировка кнопок по номеру строки

        prev_line = -1

        for button in lines_sorted_buttons:
            if button.row <= prev_line:
                continue

            line_buttons = list(filter(lambda btn: btn.row == button.row, lines_sorted_buttons))

            buttons_matrix.append([])

            columns_sorted_buttons = sorted(line_buttons, key=lambda btn: btn.column)

            for line_button in columns_sorted_buttons:
                buttons_matrix[-1].append(line_button)

            prev_line = button.row

        keyboard = BotKeyboard(one_time=True, inline=False)

        for buttons_line in buttons_matrix:
            keyboard.add_line()
            for button in buttons_line:
                keyboard.add_button(BotKeyboardButton(BotKeyboardButtonType(button.type), button.label,
                                                      BotKeyboardButtonColor(button.color),
                                                      json.dumps({'button_id': button.id})))

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

        buttons_matrix = []

        lines_sorted_buttons = sorted(step_buttons, key=lambda btn: btn.row)  # Сортировка кнопок по номеру строки
        prev_line = -1

        for button in lines_sorted_buttons:
            if button.row <= prev_line:
                continue

            line_buttons = list(filter(lambda btn: btn.row == button.row, lines_sorted_buttons))
            buttons_matrix.append([])
            columns_sorted_buttons = sorted(line_buttons, key=lambda btn: btn.column)

            for line_button in columns_sorted_buttons:
                buttons_matrix[-1].append(line_button)

            prev_line = button.row

        keyboard = BotKeyboard(one_time=True, inline=False)

        for buttons_line in buttons_matrix:
            keyboard.add_line()
            for button in buttons_line:
                keyboard.add_button(BotKeyboardButton(BotKeyboardButtonType(button.type), button.label,
                                                      BotKeyboardButtonColor(button.color),
                                                      json.dumps({'button_id': button.id})))

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
