from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class SemesterBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    days_time: Optional[datetime] = None


class SemesterCreate(SemesterBase):
    creation_date: datetime


class Semester(SemesterBase):
    id: int
    creation_user: str
    last_update_at: datetime
