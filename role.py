from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.base import Base
import uuid

class Role(Base):
    __tablename__ = "roles"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    
    users = relationship("User", back_populates="role")
