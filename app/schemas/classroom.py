from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ClassroomBase(BaseModel):
    name: str
    building: Optional[str] = None
    number: Optional[str] = None
    type: Optional[str] = None


class ClassroomCreate(ClassroomBase):
    creation_date: datetime


class Classroom(ClassroomBase):
    id: int
    creation_user: str
    last_update_at: datetime
