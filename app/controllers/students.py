from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Student
from ..schemas.student import StudentCreate


async def get_students(db: Session, skip: int = 0, limit: int = 200):
    students = db.query(Student).offset(skip).limit(limit).all()
    return students

async def get_student_by_id(db: Session, id: int):
    return db.query(Student).filter(Student.id == id).first()

async def get_student_by_username(db: Session, username: str):
    return db.query(Student).filter(Student.username == username.upper()).first()

async def create_student(db: Session, student: StudentCreate, creation_user: str):
    db_student = Student(
        username=student.username.upper(), 
        first_name=student.first_name.upper(),
        last_name=student.last_name.upper(),
        date_of_birth=student.date_of_birth,
        address=student.address.upper(),
        city=student.city.upper(),
        zipcode=student.zipcode,
        telephone=student.telephone,
        phone=student.phone,
        mobile=student.mobile,
        email=student.email.lower(),
        year_group=student.year_group,
        notes=student.notes,
        is_active=student.is_active,
        creation_date=datetime.datetime.utcnow, 
        creation_user= creation_user)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

async def update_student_by_id(db: Session, id: int):
    return 'updated'

async def delete_student_by_id(db: Session, id: int):
    return 'deleted'
