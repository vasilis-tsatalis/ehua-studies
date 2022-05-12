from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from .section import Section

class ClassroomBase(BaseModel):
    name: str
    building: Optional[str] = None
    number: Optional[str] = None
    type: Optional[str] = None


class ClassroomCreate(ClassroomBase):
    pass


class Classroom(ClassroomBase):
    id: int
    sections: List[Section] = []
    creation_user: str
    creation_date: datetime
    last_update_at: datetime

    class Config:
        orm_mode = True
