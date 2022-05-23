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

from ..schemas import course
from ..controllers import crud_courses
from ..config.database import get_db


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Course main server route listener
course_router = APIRouter(
    prefix = os.getenv("API_URL") + '/courses',
    tags=['courses']
)

@course_router.get("/", status_code = status.HTTP_200_OK)
async def get_courses(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_courses = await crud_courses.get_courses(db, skip=skip, limit=limit)
    if db_courses:
        return db_courses
    raise HTTPException(
        status_code=404, 
        detail="Courses not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@course_router.get("/{id}", status_code = status.HTTP_200_OK)
async def get_course_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_course = await crud_courses.get_course_by_id(db, id=id)
    if db_course is None:
        raise HTTPException(
            status_code=404, 
            detail="Course not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_course


@course_router.get("/name/{name}", status_code = status.HTTP_200_OK)
async def get_course_by_filename(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_course = await crud_courses.get_course_by_name(db, name=name.upper())
    if db_course is None:
        raise HTTPException(
            status_code=404, 
            detail="Course filename not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_course


@course_router.post("/", status_code = status.HTTP_201_CREATED)
async def create_course(course: course.CourseCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_course = await crud_courses.get_course_by_name(db, name=course.name.upper())
    if db_course:
        raise HTTPException(
            status_code=400, 
            detail="Course name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_courses.create_course(db, course=course, creation_user=administrator)


@course_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_course(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@course_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_course(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_courses.delete_course_by_id(db, id=id)
    db_course = await crud_courses.get_course_by_id(db, id=id)
    if db_course is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Course not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )
        

@course_router.get("/{id}/sections", status_code = status.HTTP_200_OK)
async def get_course_sections_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_course = await crud_courses.get_course_by_id(db, id=id)
    if db_course is None:
        raise HTTPException(
            status_code=404, 
            detail="Course not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    db_sections = await crud_courses.get_course_sections(db, id=db_course.id)
    if db_sections:
        return db_sections
    raise HTTPException(
        status_code=404, 
        detail="Course sections not found",
        headers={"WWW-Authenticate": "Basic"},
        )
