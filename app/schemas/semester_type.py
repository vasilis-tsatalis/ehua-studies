from datetime import datetime
import imp
from typing import List, Optional
from pydantic import BaseModel

from .course import Course

class SemesterBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    days_time: Optional[datetime] = None


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
