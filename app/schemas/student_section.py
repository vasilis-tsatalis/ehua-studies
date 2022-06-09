from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

# from .student import Student
# from .section import Section

class Student_Section_Base(BaseModel):
    student_id: int
    section_id: int
    status: Optional[int] = 0
    results: Optional[str] = None

    # class Config:
    #     orm_mode = True

class Student_Section_Create(Student_Section_Base):
    pass


class Student_Session(Student_Section_Base):
    creation_user: str
    creation_date: datetime
    last_update_at: datetime
