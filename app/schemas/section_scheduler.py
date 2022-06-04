from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from .scheduler_type import Scheduler
from .section import Section

class Section_Scheduler_Base(BaseModel):
    section_id: Section.id
    scheduler_type_id: Scheduler.id

    class Config:
        orm_mode = True

class Section_Scheduler_Create(Section_Scheduler_Base):
    pass


class Student_Session(Section_Scheduler_Base):
    creation_user: str
    creation_date: datetime
    last_update_at: datetime

