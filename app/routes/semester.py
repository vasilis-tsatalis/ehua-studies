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

from ..schemas import semester
from ..controllers import semesters
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Semester main server route listener
semester_router = APIRouter(
    prefix = os.getenv("API_URL") + '/type',
    tags=['semesters']
)

@semester_router.get("/semesters", response_model=List[semester.Semester], status_code = status.HTTP_200_OK)
async def get_semesters(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_semesters = await semesters.get_semesters(db, skip=skip, limit=limit)
    if db_semesters:
        return db_semesters
    raise HTTPException(
        status_code=404, 
        detail="Semesters not found",
        headers={"WWW-Authenticate": "Basic"},
        )

@semester_router.get("/semesters/{id}", response_model=semester.Semester, status_code = status.HTTP_200_OK)
async def get_semester_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_semester = await semesters.get_semester_by_id(db, id=id)
    if db_semester is None:
        raise HTTPException(
            status_code=404, 
            detail="Semester not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_semester


@semester_router.get("/semesters/{name}", response_model=semester.Semester, status_code = status.HTTP_200_OK)
async def get_semester_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_semester = await semesters.get_semester_by_name(db, name=name.upper())
    if db_semester is None:
        raise HTTPException(
            status_code=404, 
            detail="Semester not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_semester


@semester_router.post("/semesters", response_model=semester.Semester, status_code = status.HTTP_201_CREATED)
async def create_semester(semester: semester.SemesterCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_semester = await semesters.get_semester_by_name(db, name=semester.name.upper())
    if db_semester:
        raise HTTPException(
            status_code=400, 
            detail="Semester name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await semesters.create_semester(db, semester=semester, creation_user=administrator)


@semester_router.patch("/semesters/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_semester(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@semester_router.delete("/semesters/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_semester(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
