from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ExamBase(BaseModel):
    name: str
    gravity: Optional[str] = None


class ExamCreate(ExamBase):
    creation_date: datetime


class Exam(ExamBase):
    id: int
    creation_user: str
    last_update_at: datetime
