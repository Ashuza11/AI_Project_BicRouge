from .session import Base, engine, SessionLocal

from models.user_models import *
from models.operation_models import *


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
