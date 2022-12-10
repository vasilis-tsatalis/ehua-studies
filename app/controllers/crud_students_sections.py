from sqlalchemy.orm import Session
import datetime
from sqlalchemy.sql import func
from ..models.tables_definitions import Students_Sections
from ..schemas.student_section import Student_Section_Create


async def get_students_sections_all(db: Session, skip: int = 0, limit: int = 200):
    students_sections = db.query(Students_Sections).offset(skip).limit(limit).all()
    return students_sections

async def get_sections_per_student_id(db: Session, student_id: int):
    return db.query(Students_Sections).filter(Students_Sections.student_id == student_id).first()

async def get_students_per_section_id(db: Session, section_id: int):
    return db.query(Students_Sections).filter(Students_Sections.section_id == section_id).first()


async def create_students_sections(db: Session, student_section: Student_Section_Create, creation_user: str):
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


async def unlink_sections_by_student_id(db: Session, id: int):
    db_section = db.query(Students_Sections).filter(Students_Sections.student_id == id).all()
    db.delete(db_section)
    db.commit()
    status = 'OK'
    return status

async def unlink_students_by_section_id(db: Session, id: int):
    db_section = db.query(Students_Sections).filter(Students_Sections.section_id == id).all()
    db.delete(db_section)
    db.commit()
    status = 'OK'
    return status
