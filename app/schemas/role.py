from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    creation_date: datetime


class Role(RoleBase):
    id: int
    creation_user: str
    last_update_at: datetime
