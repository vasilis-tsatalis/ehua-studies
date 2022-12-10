import imp
from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Section, Students_Sections
from ..schemas.section import SectionCreate
from ..schemas.student_section import Student_Section_Create, Student_Section_Update


async def get_sections(db: Session, skip: int = 0, limit: int = 200):
    sections = db.query(Section).offset(skip).limit(limit).all()
    return sections

async def get_section_by_id(db: Session, id: int):
    return db.query(Section).filter(Section.id == id).first()

async def create_section(db: Session, section: SectionCreate, creation_user: str):
    db_section = Section(
        course_id=section.course_id, 
        professor_id=section.professor_id, 
        exam_type_id=section.exam_type_id,
        classroom_type_id=section.classroom_type_id,
        year=section.year,
        creation_user=creation_user)
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

async def update_section_by_id(db: Session, id: int):
    return 'updated'

async def delete_section_by_id(db: Session, id: int):
    db_section = db.query(Section).filter(Section.id == id).first()
    db.delete(db_section)
    db.commit()
    status = 'OK'
    return status

async def get_section_students(db: Session, id: int):
    return db.query(Students_Sections).filter(Students_Sections.section_id == id).all()

async def create_section_student(db: Session, student_section: Student_Section_Create, creation_user: str):
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

async def get_sections_students(db: Session, skip: int = 0, limit: int = 200):
    students_sections = db.query(Students_Sections).offset(skip).limit(limit).all()
    return students_sections

async def get_section_and_student(db: Session, section_id: int, student_id: int):
    return db.query(Students_Sections).filter(Students_Sections.section_id == section_id, Students_Sections.student_id == student_id).first()

async def update_section_student_degree(db: Session, student_section: Student_Section_Update, creation_user: str):
    db_student_section = db.query(Students_Sections).filter(Students_Sections.section_id == student_section.section_id, Students_Sections.student_id == student_section.student_id).first()
    db_student_section.status = student_section.status
    db_student_section.results = student_section.results
    db.flush()
    db.commit()
    return db_student_section
