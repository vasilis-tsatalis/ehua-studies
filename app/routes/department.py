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

from ..schemas import department
from ..controllers import departments
from ..config.database import get_db


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Department main server route listener
department_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['departments']
)


@department_router.get("/departments", response_model=List[department.Department], status_code = status.HTTP_200_OK)
async def get_departments(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_departments = await departments.get_departments(db, skip=skip, limit=limit)
    if db_departments:
        return db_departments
    raise HTTPException(
        status_code=404, 
        detail="Departments not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@department_router.get("/departments/{id}", response_model=department.Department, status_code = status.HTTP_200_OK)
async def get_department_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_department = await departments.get_department_by_id(db, id=id)
    if db_department is None:
        raise HTTPException(
            status_code=404, 
            detail="Department not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_department


@department_router.get("/departments/{name}", response_model=department.Department, status_code = status.HTTP_200_OK)
async def get_department_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_department = await departments.get_department_by_name(db, name=name.upper())
    if db_department is None:
        raise HTTPException(
            status_code=404, 
            detail="Department not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_department


@department_router.post("/departments", response_model=department.Department, status_code = status.HTTP_201_CREATED)
async def create_department(department: department.DepartmentCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_department = await departments.get_department_by_name(db, name=department.name.upper())
    if db_department:
        raise HTTPException(
            status_code=400, 
            detail="Department name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await departments.create_department(db, department=department, creation_user=administrator)


@department_router.patch("/departments/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_department(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@department_router.delete("/departments/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_department(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
