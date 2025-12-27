from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TimeStampedModel(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

