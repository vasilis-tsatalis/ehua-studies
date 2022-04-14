from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class SchedulerBase(BaseModel):
    name: str
    day: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None


class SchedulerCreate(SchedulerBase):
    creation_date: datetime


class Scheduler(SchedulerBase):
    id: int
    creation_user: str
    last_update_at: datetime
