from .models import Step, Button
from server import db


def get_steps_list():
    return Step.query.all()


def get_step(step_id: int):
    return Step.query.get(step_id)


def add_step(text: str):
    new_step = Step(text=text)
    db.session.add(new_step)
    db.session.commit()

    return new_step


def get_first_step():
    return Step.query.filter(Step.from_button == None).first()


def get_button(button_id: int):
    return Button.query.get(button_id)
