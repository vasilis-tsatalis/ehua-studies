from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Course
from ..schemas.course import CourseCreate


async def get_courses(db: Session, skip: int = 0, limit: int = 200):
    courses = db.query(Course).offset(skip).limit(limit).all()
    return courses

async def get_course_by_id(db: Session, id: int):
    return db.query(Course).filter(Course.id == id).first()

async def get_course_by_name(db: Session, name: str):
    return db.query(Course).filter(Course.name == name.upper()).first()

async def create_course(db: Session, course: CourseCreate):
    db_course = Course(department_id=course.department_id, name=course.name.upper(), description=course.description, 
        is_active=course.is_active, semester_type_id=course.semester_type_id, gravity= course.gravity)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

async def update_course_by_id(db: Session, id: int):
    return 'updated'

async def delete_course_by_id(db: Session, id: int):
    return 'deleted'
