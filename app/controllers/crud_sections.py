from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Section
from ..schemas.section import SectionCreate


async def get_sections(db: Session, skip: int = 0, limit: int = 200):
    sections = db.query(Section).offset(skip).limit(limit).all()
    return sections

async def get_section_by_id(db: Session, id: int):
    return db.query(Section).filter(Section.id == id).first()

async def create_section(db: Session, section: SectionCreate):
    db_section = Section(
        course_id=section.course_id, 
        professor_id=section.professor_id, 
        exam_type_id=section.exam_type_id,
        classroom_type_id=section.classroom_type_id,
        year=section.year)
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
