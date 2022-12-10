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

from ..schemas import student, student_section
from ..controllers import crud_students, crud_sections
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Student main server route listener
student_router = APIRouter(
    prefix = os.getenv("API_URL") + '/students',
    tags=['students']
)

@student_router.get("/", status_code = status.HTTP_200_OK)
async def get_students(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_students = await crud_students.get_students(db, skip=skip, limit=limit)
    if db_students:
        return db_students
    raise HTTPException(
        status_code=404, 
        detail="Students not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@student_router.get("/{id}", status_code = status.HTTP_200_OK)
async def get_student_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_id(db, id=id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_student


@student_router.get("/username/{username}", status_code = status.HTTP_200_OK)
async def get_student_by_username(username: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_username(db, username=username.upper())
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_student


@student_router.post("/", status_code = status.HTTP_201_CREATED)
async def create_student(student: student.StudentCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_username(db, username=student.username.upper())
    if db_student:
        raise HTTPException(
            status_code=400, 
            detail="Student username already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_students.create_student(db, student=student, creation_user=administrator)


@student_router.put("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_student(id: int, student: student.StudentUpdate, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_id(db, id=id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return await crud_students.update_student_by_id(db, id=id, student=student, creation_user=webuser)


@student_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_student(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_students.delete_student_by_id(db, id=id)
    db_student = await crud_students.get_student_by_id(db, id=id)
    if db_student is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Student not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )


@student_router.get("/{id}/sections", status_code = status.HTTP_200_OK)
async def get_student_sections_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_id(db, id=id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    db_sections = await crud_students.get_student_sections(db, id=id)
    if db_sections:
        return db_sections
    else:
        raise HTTPException(
            status_code=404, 
            detail="No Student sections found",
            headers={"WWW-Authenticate": "Basic"},
            )


@student_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def activate_student(id: int, is_active: bool, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_id(db, id=id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return await crud_students.enable_student_by_id(db, id=id, is_active=is_active)



@student_router.post("/sections", status_code = status.HTTP_201_CREATED)
async def create_student_section(student_section: student_section.Student_Section_Create, webuser: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_student = await crud_students.get_student_by_id(db, id=student_section.student_id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found", 
            headers={"WWW-Authenticate": "Basic"},
        )
    db_section = await crud_sections.get_section_by_id(db, id=student_section.section_id)
    if db_section is None:
        raise HTTPException(
            status_code=404, 
            detail="Section not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return await crud_students.create_student_section(db, student_section=student_section, creation_user=webuser)


@student_router.get("/sections", status_code = status.HTTP_200_OK)
async def get_students_sections(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_students = await crud_students.get_students_sections(db, skip=skip, limit=limit)
    if db_students:
        return db_students
    raise HTTPException(
        status_code=404, 
        detail="Students sections not found",
        headers={"WWW-Authenticate": "Basic"},
        )
