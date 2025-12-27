import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime
from datetime import datetime
from app.db.base import Base
from sqlalchemy.orm import relationship

class ProcessStep(Base):
    __tablename__ = "process_steps"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    process_id = Column(String, ForeignKey("processes.id"), nullable=False)
    position = Column(Integer, nullable=False, default=0)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    responsible_user_id = Column(String, nullable=True)
    responsible_role = Column(String, nullable=True)
    estimated_minutes = Column(Integer, nullable=True)
    tools = Column(Text, nullable=True)  # comma-separated simple list
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    process = relationship("Process", back_populates="steps")
    failures = relationship("StepFailure", back_populates="step", cascade="all, delete-orphan")
