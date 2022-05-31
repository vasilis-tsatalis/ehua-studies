from datetime import datetime
import imp
from typing import List, Optional
from pydantic import BaseModel

from .course import Course

class SemesterBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class SemesterCreate(SemesterBase):
    pass


class Semester(SemesterBase):
    id: int
    courses: List[Course] = []
    creation_user: str
    creation_date: datetime
    last_update_at: datetime

    class Config:
        orm_mode = True
