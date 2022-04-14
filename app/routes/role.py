from fastapi import Depends, status, Request, HTTPException
from fastapi import APIRouter
from fastapi.security import HTTPBasic
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv
load_dotenv()

from ..auth.authentication import authenticate_admin, authenticate_webuser
security = HTTPBasic()

from ..schemas import role
from ..controllers import roles
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Role main server route listener
role_router = APIRouter(
    prefix = os.getenv("API_URL") + '/type',
    tags=['roles']
)

@role_router.get("/roles", response_model=List[role.Role], status_code = status.HTTP_200_OK)
async def get_roles(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_roles = await roles.get_roles(db, skip=skip, limit=limit)
    if db_roles:
        return db_roles
    raise HTTPException(
        status_code=404, 
        detail="Roles not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@role_router.get("/roles/{id}", response_model=role.Role, status_code = status.HTTP_200_OK)
async def get_role_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_role = await roles.get_role_by_id(db, id=id)
    if db_role is None:
        raise HTTPException(
            status_code=404, 
            detail="Role not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_role


@role_router.get("/roles/{name}", response_model=role.Role, status_code = status.HTTP_200_OK)
async def get_role_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_role = await roles.get_role_by_name(db, name=name.upper())
    if db_role is None:
        raise HTTPException(
            status_code=404, 
            detail="Role not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_role


@role_router.post("/roles", response_model=role.Role, status_code = status.HTTP_201_CREATED)
async def create_role(role: role.RoleCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_role = await roles.get_role_by_name(db, name=role.name.upper())
    if db_role:
        raise HTTPException(
            status_code=400, 
            detail="Role name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await roles.create_role(db, role=role, creation_user=administrator)


@role_router.patch("/roles/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_role(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@role_router.delete("/roles/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_role(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
