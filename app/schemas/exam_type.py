from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ExamBase(BaseModel):
    name: str
    gravity: Optional[str] = None


class ExamCreate(ExamBase):
    pass


class Exam(ExamBase):
    id: int
    creation_user: str
    creation_date: datetime
    last_update_at: datetime
