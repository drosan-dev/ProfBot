from bot import Bot
import os


def main():
    vk_token = os.environ.get("VK_TOKEN")
    bot = Bot(token=vk_token)
    bot.handle_events()


if __name__ == '__main__':
    main()
