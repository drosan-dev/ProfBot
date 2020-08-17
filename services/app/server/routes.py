import os
from flask import request, json

from server import app
from bot.router import Router

# Access токен, полученный в сообществе ВК
token = os.environ.get("VK_TOKEN")

# Код подтверждения сервера, полученный в сообществе ВК
confirmation_token = os.environ.get("CONFIRMATION_TOKEN")

router = Router(token)


@app.route('/', methods=['POST'])
def processing():
    """
    Точка входа в приложение

    :return: 'ok' для того, чтобы ВК понял что запрос обработан
    """

    try:
        data = json.loads(request.data)
    except ValueError:
        return 'denied'
    except TypeError:
        return 'denied'

    # Запрос от VK Callback API всегда содержит поле type
    if 'type' not in data.keys():
        return 'denied'

    # Подтверждение сервера
    if data['type'] == 'confirmation':
        return confirmation_token

    # Передаем запрос для обработки в роутер
    router.route(data)

    return 'ok'
