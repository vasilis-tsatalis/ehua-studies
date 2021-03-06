from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Department, Course
from ..schemas.department import DepartmentCreate


async def get_departments(db: Session, skip: int = 0, limit: int = 200):
    departments = db.query(Department).offset(skip).limit(limit).all()
    return departments

async def get_department_by_id(db: Session, id: int):
    return db.query(Department).filter(Department.id == id).first()

async def get_department_by_name(db: Session, name: str):
    return db.query(Department).filter(Department.name == name.upper()).first()

async def create_department(db: Session, department: DepartmentCreate, creation_user: str):
    db_department = Department(name=department.name.upper(), description=department.description, points=department.points, creation_user= creation_user)
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

async def update_department_by_id(db: Session, id: int):
    return 'updated'

async def delete_department_by_id(db: Session, id: int):
    db_department = db.query(Department).filter(Department.id == id).first()
    db.delete(db_department)
    db.commit()
    status = 'OK'
    return status

async def get_department_courses(db: Session, id: int):
    db_courses =  db.query(Course).filter(Course.department_id == id).all()
    return db_courses
