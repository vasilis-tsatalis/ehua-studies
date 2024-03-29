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

from ..schemas import section, student_section
from ..controllers import crud_sections,crud_students,crud_students_sections
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Section main server route listener
section_router = APIRouter(
    prefix = os.getenv("API_URL") + '/sections',
    tags=['sections']
)


@section_router.get("/", status_code = status.HTTP_200_OK)
async def get_sections(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_sections = await crud_sections.get_sections(db, skip=skip, limit=limit)
    if db_sections:
        return db_sections
    raise HTTPException(
        status_code=404, 
        detail="Sections not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@section_router.get("/{id}", status_code = status.HTTP_200_OK)
async def get_section_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_section = await crud_sections.get_section_by_id(db, id=id)
    if db_section is None:
        raise HTTPException(
            status_code=404, 
            detail="Section not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_section


@section_router.post("/", status_code = status.HTTP_201_CREATED)
async def create_section(section: section.SectionCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return await crud_sections.create_section(db, section=section, creation_user=administrator)


@section_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_section(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@section_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_section(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_sections.delete_section_by_id(db, id=id)
    db_section = await crud_sections.get_section_by_id(db, id=id)
    if db_section is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Section not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )


@section_router.get("/{id}/students", status_code = status.HTTP_200_OK)
async def get_section_students_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_section = await crud_sections.get_section_by_id(db, id=id)
    if db_section is None:
        raise HTTPException(
            status_code=404, 
            detail="Section not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    db_students = await crud_sections.get_section_students(db, id=id)
    if db_students:
        return db_students
    else:
        raise HTTPException(
            status_code=404, 
            detail="No Section students found",
            headers={"WWW-Authenticate": "Basic"},
            )


@section_router.post("/students", status_code = status.HTTP_201_CREATED)
async def create_section_student(student_section: student_section.Student_Section_Create, webuser: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_section = await crud_sections.get_section_by_id(db, id=student_section.section_id)
    if db_section is None:
        raise HTTPException(
            status_code=404, 
            detail="Section not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    db_student = await crud_students.get_student_by_id(db, id=student_section.student_id)
    if db_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student not found", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_sections.create_section_student(db, student_section=student_section, creation_user=webuser)


@section_router.put("/students", status_code = status.HTTP_200_OK)
async def create_section_student(student_section: student_section.Student_Section_Update, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_section_student = await crud_sections.get_section_and_student(db, section_id=student_section.section_id, student_id=student_section.student_id)
    if db_section_student is None:
        raise HTTPException(
            status_code=404, 
            detail="Student is not connected with this Section",
            headers={"WWW-Authenticate": "Basic"},
            )
    return await crud_sections.update_section_student_degree(db, student_section=student_section, creation_user=webuser)


@section_router.get("/students", status_code = status.HTTP_200_OK)
async def get_sections_students(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_sections = await crud_students_sections.get_students_sections_all(db, skip=skip, limit=limit)
    if db_sections:
        return db_sections
    raise HTTPException(
        status_code=404, 
        detail="Sections students not found",
        headers={"WWW-Authenticate": "Basic"},
        )

