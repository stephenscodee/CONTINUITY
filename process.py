from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.common import TimeStampedModel
from app.schemas.failure import FailureRead

class ProcessStepCreate(BaseModel):
    title: str
    description: Optional[str] = None
    responsible_user_id: Optional[str] = None
    responsible_role: Optional[str] = None
    estimated_minutes: Optional[int] = None
    tools: Optional[str] = None
    position: Optional[int] = 0

class StepRead(TimeStampedModel):
    id: str
    process_id: str
    title: str
    description: Optional[str] = None
    responsible_user_id: Optional[str] = None
    responsible_role: Optional[str] = None
    estimated_minutes: Optional[int] = None
    tools: Optional[str] = None
    position: int
    failures: List[FailureRead] = []

class ProcessCreate(BaseModel):
    name: str
    objective: Optional[str] = None
    frequency: Optional[str] = None
    owner_user_id: Optional[str] = None

class ProcessUpdate(BaseModel):
    name: Optional[str] = None
    objective: Optional[str] = None
    frequency: Optional[str] = None
    owner_user_id: Optional[str] = None
    validated: Optional[bool] = None

class ProcessRead(TimeStampedModel):
    id: str
    name: str
    objective: Optional[str] = None
    frequency: Optional[str] = None
    owner_user_id: Optional[str] = None
    validated: bool = False
    last_used_at: Optional[datetime] = None
    steps: List[StepRead] = []
