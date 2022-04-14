from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    points: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    creation_date: datetime


class Department(DepartmentBase):
    id: int
    creation_user: str
    last_update_at: datetime
