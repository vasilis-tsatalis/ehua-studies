from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class SectionBase(BaseModel):
    course_id: int
    professor_id: int
    classroom_type_id: int
    exam_type_id: Optional[int]


class SectionAuto(SectionBase):
    pass


class SectionCreate(SectionAuto):
    year: int


class Section(SectionBase): 
    id: int
    creation_user: str
    creation_date: datetime
    last_update_at: datetime
