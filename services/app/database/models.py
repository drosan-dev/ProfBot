from server import db
from datetime import datetime


class Step(db.Model):
    """
    Модель шага
    Attributes:
        id: int - ID шага
        text: str - Текст, который послыается вместе с кнопками шага
        buttons: [Button] - Кнопки клавиатуры данного шага
        from_button: Button - Кнопка с которой идкт переход на данный шаг
        created_at: datetime - Дата создания шага
        updated_at: datetime - Дата последнего изменения шага
    """
    __tablename__ = 'steps'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String())

    buttons = db.relationship('Button', backref='step', lazy=True, foreign_keys='Button.step_id', passive_deletes=True)
    from_button = db.relationship('Button', backref='next_step', uselist=False, foreign_keys='Button.to_step_id',
                                  lazy=False, passive_deletes=True)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, text:str):
        self.text = text

    def __repr__(self):
        return "<steps {}>".format(self.id)


class Button(db.Model):
    """
    Модель шага
    Attributes:
        id: int - ID кнопки
        type: str - Тип кнопки. Поддерживаемые типы см.:BotKeyboardButtonType в bot/keyboard.py
        label: str - Текст на кнопке
        color: str - Цвет кнопки. Поддерживаемые цвета см.:BotKeyboardButtonColor в bot/keyboard.py
        row: int - Номер строки, в которой находится кнопка в клавиатуре
        column: int - Порядковый номер кнопки в строке клавиатуры
        to_step_id: int - ID шага, на который будет переход по нажатию на кнопку
        step_id: int - ID шага, на котором находится кнопка
        next_step: Step - Шаг на который будет переход по нажатию на кнопку
        step: Step - Шаг на котором находится кнопка
        created_at: datetime - Дата создания кнопки
        updated_at: datetime - Дата последнего изменения кнопки
    """
    __tablename__ = 'buttons'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(), nullable=False)
    label = db.Column(db.String(), nullable=False)
    color = db.Column(db.String(), nullable=False)

    row = db.Column(db.Integer, nullable=False)
    column = db.Column(db.Integer, nullable=False)

    to_step_id = db.Column(db.Integer, db.ForeignKey('steps.id', ondelete='CASCADE'))
    step_id = db.Column(db.Integer, db.ForeignKey('steps.id', ondelete='CASCADE'))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<buttons {}>".format(self.id)
