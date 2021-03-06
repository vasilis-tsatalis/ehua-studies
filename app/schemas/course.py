from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from .section import Section

class CourseBase(BaseModel):
    department_id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    semester_type_id: int
    gravity: str


class CourseCreate(CourseBase):
    pass


class Course(CourseBase): 
    id: int
    sections: List[Section] = []
    creation_user: str
    creation_date: datetime
    last_update_at: datetime

    class Config:
        orm_mode = True
