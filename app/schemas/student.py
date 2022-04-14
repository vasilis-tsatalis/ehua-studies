from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class StudentBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    date_of_birth: Optional[str] = Field(example = "DD-MM-YYYY")
    address: Optional[str] = None
    city: Optional[str] = None
    zipcode: Optional[str] = None
    telephone: Optional[str] = None
    phone: Optional[str] = None
    mobile: str
    email: str
    year_group: int = Field(example = 2020)
    notes: Optional[str] = None
    is_active: Optional[bool] = True


class StudentCreate(StudentBase):
    creation_date: datetime


class Student(StudentBase):
    id: int
    creation_user: str
    last_update_at: datetime
