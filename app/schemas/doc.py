from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class DocBase(BaseModel):
    professor_id: int
    document_type_id: int
    notes: Optional[str] = None


class DocAuto(DocBase):
    name: str
    bucket: str
    extension: str
    filename: str


class DocCreate(DocAuto):
    expiration_days: int
    creation_date: datetime


class Doc(DocBase): 
    id: int
    filename: str
    url: str
    creation_user: str
    last_update_at: datetime
