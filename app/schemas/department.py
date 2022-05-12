from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

from .course import Course

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    points: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class Department(DepartmentBase):
    id: int
    courses: List[Course] = []
    creation_user: str
    creation_date: datetime
    last_update_at: datetime

    class Config:
        orm_mode = True
