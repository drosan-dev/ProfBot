"""empty message

Revision ID: b22764e3fbfa
Revises: ee1eb48e8c64
Create Date: 2020-08-18 21:43:29.879514

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b22764e3fbfa'
down_revision = 'ee1eb48e8c64'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('roles', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('roles', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'created_at')
    op.drop_column('roles', 'updated_at')
    op.drop_column('roles', 'created_at')
    # ### end Alembic commands ###
