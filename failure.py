from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.common import TimeStampedModel

class FailureCreate(BaseModel):
    description: str
    reason: Optional[str] = None
    impact: Optional[str] = None

class FailureUpdate(BaseModel):
    description: Optional[str] = None
    reason: Optional[str] = None
    impact: Optional[str] = None

class FailureRead(TimeStampedModel):
    id: str
    step_id: str
    description: str
    reason: Optional[str] = None
    impact: Optional[str] = None
    reported_at: Optional[datetime] = None

