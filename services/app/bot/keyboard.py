from enum import Enum


class BotKeyboardButtonType(Enum):
    """
    Перечисление типов кнопок для клавиатуры ВК
    """
    TEXT = "text"
    CALLBACK = "callback"


class BotKeyboardButtonColor(Enum):
    """
    Перечисление цветов для кнопок
    """
    PRIMARY = "primary"
    DEFAULT = "default"
    POSITIVE = "positive"
    NEGATIVE = "negative"


class BotKeyboardButton(object):
    """
    Кнопка клавиатуры бота
    Attributes:
        button_type: BotKeyboardButtonType - Тип кнопки
        label: str - Текст на кнопке
        color: BotKeyboardButtonColor - Цвет кнопки
        payload: str - Полезная нагрузка кнопки (дополнительные данные, которые передаются по нажатю на эту кнопку)
    """
    def __init__(self, button_type: BotKeyboardButtonType, label: str,
                 color: BotKeyboardButtonColor, payload: str = None):
        self.button_type = button_type
        self.label = label
        self.payload = payload
        self.color = color

    def get_button(self):
        """
        Получение JSON представления кнопки
        """
        return {
            "action": {
                "type": self.button_type.value,
                "payload": self.payload,
                "label": self.label
            },
            "color": self.color.value
        }


class BotKeyboard(object):
    """
    Клавиатура бота
    Attributes:
        one_time: bool - Если True, то клавиатура скрывается после нажатия на кнопку
        inline: bool - Если True, то клавиатура будет находиться в сообщении. Не работает вместе с one_time
        buttons: [[BotKeyboardButton]] - Двумерный список кнопок в клавиатуре
    """
    def __init__(self, one_time=False, inline=False, buttons: list = None):
        if buttons is None:
            buttons = []
        self.one_time = one_time
        self.inline = inline
        self.buttons = buttons

    def set_one_time(self, one_time: bool):
        """
        Меняет значение поля one_time у клавиатуры
        :param one_time: bool
        :return: None
        """
        self.one_time = one_time

    def set_inline(self, inline: bool):
        """
        Меняет значение поля inline у клавиатуры
        :param inline: bool
        :return: None
        """
        self.inline = inline

    def add_line(self):
        """
        Добавляет пустую строку в клавиатуру если строк нет или последняя строка не пустая
        Количество строк должно быть <= 10 - ограничение ВК
        :return: None
        """
        if len(self.buttons) >= 10:
            raise ValueError("Lines count must be less than or equal to 10")

        if len(self.buttons) == 0 or len(self.buttons[-1]) != 0:
            self.buttons.append([])

    def add_button(self, button: BotKeyboardButton):
        """
        Добавляет кнопку в последнюю строку клавиатуры. Если строк нет, то добавляет строку.
        Количество кнопок в строке должно быть <= 4 - ограничение ВК
        :param button: BotKeyboardButton - Кнопка
        :return: None
        """
        if len(self.buttons) == 0:
            self.buttons.append([])

        if len(self.buttons[-1]) >= 4:
            raise ValueError("Length of line must be less than or equal to 4")

        self.buttons[-1].append(button)

    def get_keyboard(self):
        """
        Получение JSON представления клавиатуры, очищение кнопок
        :return:
        """
        keyboard = {
            "one_time": self.one_time,
            "inline": self.inline,
            "buttons": list(map(lambda line: list(map(lambda button: button.get_button(), line)), self.buttons))
        }

        self.buttons = [[]]

        return keyboard
