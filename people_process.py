import uuid
from sqlalchemy import Column, String
from app.db.base import Base

class PeopleProcess(Base):
    __tablename__ = "people_processes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False)
    process_id = Column(String, nullable=False)
    role = Column(String, nullable=True)
    criticidad = Column(String, nullable=True)  # baja,media,alta

