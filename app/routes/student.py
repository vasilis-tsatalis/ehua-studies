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

from ..schemas import student
from ..controllers import students
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Student main server route listener
student_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['students']
)

@student_router.get("/students", response_model=List[student.Student], status_code = status.HTTP_200_OK)
async def get_students(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_students = await students.get_students(db, skip=skip, limit=limit)
    if db_students:
        return db_students
    raise HTTPException(
        status_code=404, 
        detail="Students not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@student_router.get("/students/{id}", response_model=student.Student, status_code = status.HTTP_200_OK)
async def get_student_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_student = await students.get_student_by_id(db, id=id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_student


@student_router.get("/students/{username}", response_model=student.Student, status_code = status.HTTP_200_OK)
async def get_student_by_username(username: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_student = await students.get_student_by_username(db, username=username.upper())
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_student


@student_router.post("/students", response_model=student.Student, status_code = status.HTTP_201_CREATED)
async def create_student(student: student.StudentCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_student = await students.get_student_by_username(db, username=student.username.upper())
    if db_student:
        raise HTTPException(
            status_code=400, 
            detail="Student username already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await students.create_student(db, student=student, creation_user=administrator)


@student_router.patch("/students/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_student(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@student_router.delete("/students/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_student(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
