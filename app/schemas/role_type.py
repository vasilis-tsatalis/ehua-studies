from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class Role(RoleBase):
    id: int
    creation_user: str
    creation_date: datetime
    last_update_at: datetime
