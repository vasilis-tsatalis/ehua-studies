from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class DocumentBase(BaseModel):
    name: str
    description: Optional[str] = None


class DocumentCreate(DocumentBase):
    pass


class Document(DocumentBase):
    id: int
    creation_user: str
    creation_date: datetime
    last_update_at: datetime
