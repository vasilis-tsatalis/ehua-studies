from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from .section import Section

class ExamBase(BaseModel):
    name: str
    gravity: Optional[str] = None


class ExamCreate(ExamBase):
    pass


class Exam(ExamBase):
    id: int
    sections: List[Section] = []
    creation_user: str
    creation_date: datetime
    last_update_at: datetime

    class Config:
        orm_mode = True
