from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class DocumentBase(BaseModel):
    name: str
    description: Optional[str] = None


class DocumentCreate(DocumentBase):
    creation_date: datetime


class Document(DocumentBase):
    id: int
    creation_user: str
    last_update_at: datetime
