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

from ..schemas import semester_type
from ..controllers import crud_semesters_type
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Semester main server route listener
semester_router = APIRouter(
    prefix = os.getenv("API_URL") + '/semesters_type',
    tags=['semesters']
)

@semester_router.get("/", status_code = status.HTTP_200_OK)
async def get_semesters(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_semesters = await crud_semesters_type.get_semesters(db, skip=skip, limit=limit)
    if db_semesters:
        return db_semesters
    raise HTTPException(
        status_code=404, 
        detail="Semesters not found",
        headers={"WWW-Authenticate": "Basic"},
        )

@semester_router.get("/{id}", status_code = status.HTTP_200_OK)
async def get_semester_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_semester = await crud_semesters_type.get_semester_by_id(db, id=id)
    if db_semester is None:
        raise HTTPException(
            status_code=404, 
            detail="Semester not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_semester


@semester_router.get("/name/{name}", status_code = status.HTTP_200_OK)
async def get_semester_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_semester = await crud_semesters_type.get_semester_by_name(db, name=name.upper())
    if db_semester is None:
        raise HTTPException(
            status_code=404, 
            detail="Semester not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_semester


@semester_router.post("/", status_code = status.HTTP_201_CREATED)
async def create_semester(semester: semester_type.SemesterCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_semester = await crud_semesters_type.get_semester_by_name(db, name=semester.name.upper())
    if db_semester:
        raise HTTPException(
            status_code=400, 
            detail="Semester name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_semesters_type.create_semester(db, semester=semester, creation_user=administrator)


@semester_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_semester(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@semester_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_semester(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_semesters_type.delete_semester_by_id(db, id=id)
    db_semester = await crud_semesters_type.get_semester_by_id(db, id=id)
    if db_semester is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Semester not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )
