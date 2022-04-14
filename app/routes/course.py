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
from ..controllers import courses
from ..config.database import get_db


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Course main server route listener
course_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['courses']
)

@course_router.get("/courses", response_model=List[course.Course], status_code = status.HTTP_200_OK)
async def get_courses(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_courses = await courses.get_courses(db, skip=skip, limit=limit)
    if db_courses:
        return db_courses
    raise HTTPException(
        status_code=404, 
        detail="Courses not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@course_router.get("/courses/{id}", response_model=course.Course, status_code = status.HTTP_200_OK)
async def get_doc_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_course = await courses.get_course_by_id(db, id=id)
    if db_course is None:
        raise HTTPException(
            status_code=404, 
            detail="Course not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_course


@course_router.get("/courses/{name}", response_model=course.Course, status_code = status.HTTP_200_OK)
async def get_doc_by_filename(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_course = await courses.get_course_by_name(db, name=name.upper())
    if db_course is None:
        raise HTTPException(
            status_code=404, 
            detail="Course filename not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_course


@course_router.post("/courses", response_model=course.Course, status_code = status.HTTP_201_CREATED)
async def create_doc(course: course.CourseCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_course = await courses.get_course_by_name(db, name=course.name.upper())
    if db_course:
        raise HTTPException(
            status_code=400, 
            detail="Course name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await courses.create_course(db, course=course, creation_user=administrator)


@course_router.patch("/courses/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_course(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@course_router.delete("/courses/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_course(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
