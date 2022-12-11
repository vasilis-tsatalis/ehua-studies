from sqlalchemy.orm import Session
import datetime
from sqlalchemy.sql import func
from ..models.tables_definitions import Student, Students_Sections
from ..schemas.student import StudentCreate, StudentUpdate
from ..schemas.student_section import Student_Section_Create



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
        creation_user= creation_user)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

async def update_student_by_id(db: Session, id: int, student: StudentUpdate, creation_user: str):
    # db.query(Student).filter(Student.id == id).update([
    #     {Student.address: student.address.upper()},
    #     {Student.city: student.city.upper()},
    #     {Student.zipcode: student.zipcode},
    #     {Student.telephone: student.telephone},
    #     {Student.phone: student.phone},
    #     {Student.mobile: student.mobile},
    #     {Student.email: student.email.lower()},
    #     {Student.notes: student.notes},
    #     {Student.creation_user: creation_user},
    #     {Student.last_update_at: func.now()}
    # ])
    db_student = db.query(Student).filter(Student.id == id).first()
    db_student.address = student.address.upper()
    db_student.city = student.city.upper()
    db_student.zipcode = student.zipcode
    db_student.telephone = student.telephone
    db_student.phone = student.phone
    db_student.mobile = student.mobile
    db_student.notes = student.notes
    db_student.creation_user = creation_user
    db.flush()
    db.commit()
    # db.refresh(db_student)
    return db_student

async def delete_student_by_id(db: Session, id: int):
    db_student = db.query(Student).filter(Student.id == id).first()
    db.delete(db_student)
    db.commit()
    status = 'OK'
    return status

async def get_student_sections(db: Session, id: int):
    return db.query(Students_Sections).filter(Students_Sections.student_id == id).all()

async def enable_student_by_id(db: Session, id: int, is_active: bool):
    db_student = db.query(Student).filter(Student.id == id).first()
    db_student.is_active = is_active
    db.flush()
    db.commit()
    # db.refresh(db_student)
    return db_student


async def create_student_section(db: Session, student_section: Student_Section_Create, creation_user: str):
    db_student_section = Students_Sections(
        student_id=student_section.student_id, 
        section_id=student_section.section_id,
        status=student_section.status,
        results=student_section.results.upper(),
        creation_user= creation_user)
    db.add(db_student_section)
    db.commit()
    db.refresh(db_student_section)
    return db_student_section
    

async def get_students_sections(db: Session, skip: int = 0, limit: int = 200):
    students_sections = db.query(Students_Sections).offset(skip).limit(limit).all()
    return students_sections

