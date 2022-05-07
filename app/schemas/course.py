from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from .department import Department
from .semester_type import Semester


class CourseBase(BaseModel):
    department_id: Department.id
    name: str
    description: Optional[str] = None
    is_active: bool
    semester_type_id: Semester.id
    gravity: str

    class Config:
        orm_mode = True


class CourseCreate(CourseBase):
    pass


class Course(CourseBase): 
    id: int
    last_update_at: datetime
