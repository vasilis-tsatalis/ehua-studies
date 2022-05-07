from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

from .professor import Professor
from .document_type import Document
 
class DocBase(BaseModel):
    professor_id: Professor.id
    document_type_id: Document.id
    notes: Optional[str] = None

    class Config:
        orm_mode = True

class DocAuto(DocBase):
    name: str
    bucket: str
    extension: str
    filename: str
    url: str


class DocCreate(DocAuto):
    expiration_days: int
    


class Doc(DocBase): 
    id: int
    filename: str
    url: str
    creation_user: str
    creation_date: datetime
    last_update_at: datetime
