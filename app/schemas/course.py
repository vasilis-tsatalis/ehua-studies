from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class CourseBase(BaseModel):
    department_id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    semester_type_id: int


class CourseCreate(CourseBase):
    gravity: str


class Course(CourseBase): 
    id: int
    last_update_at: datetime
