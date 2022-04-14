from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class ProfessorBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    date_of_birth: Optional[str] = Field(example = "DD-MM-YYYY")
    address: Optional[str] = None
    city: Optional[str] = None
    zipcode: Optional[str] = None
    telephone: Optional[str] = None
    office_phone: Optional[str] = None
    mobile: str
    email: str
    title: Optional[str] = None
    level: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = True


class ProfessorCreate(ProfessorBase):
    creation_date: datetime


class Professor(ProfessorBase):
    id: int
    creation_user: str
    last_update_at: datetime
