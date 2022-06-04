from sqlalchemy.orm import Session
import datetime
from sqlalchemy.sql import func
from ..models.tables_definitions import Professor, Document, Section
from ..schemas.professor import ProfessorCreate, ProfessorUpdate


async def get_professors(db: Session, skip: int = 0, limit: int = 200):
    professors = db.query(Professor).offset(skip).limit(limit).all()
    return professors

async def get_professor_by_id(db: Session, id: int):
    return db.query(Professor).filter(Professor.id == id).first()

async def get_professor_by_username(db: Session, username: str):
    return db.query(Professor).filter(Professor.username == username.upper()).first()

async def create_professor(db: Session, professor: ProfessorCreate, creation_user: str):
    db_professor = Professor(
        username=professor.username.upper(), 
        first_name=professor.first_name.upper(),
        last_name=professor.last_name.upper(),
        date_of_birth=professor.date_of_birth,
        address=professor.address.upper(),
        city=professor.city.upper(),
        zipcode=professor.zipcode,
        telephone=professor.telephone,
        office_phone=professor.office_phone,
        mobile=professor.mobile,
        email=professor.email.lower(),
        title=professor.title,
        level=professor.level,
        notes=professor.notes,
        is_active=professor.is_active,
        creation_user= creation_user)
    db.add(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor

async def update_professor_by_id(db: Session, id: int, professor: ProfessorUpdate, creation_user: str):
    # db.query(Professor).filter(Professor.id == id).update([
    #     {Professor.address: professor.address.upper()},
    #     {Professor.city: professor.city.upper()},
    #     {Professor.zipcode: professor.zipcode},
    #     {Professor.telephone: professor.telephone},
    #     {Professor.office_phone: professor.office_phone},
    #     {Professor.mobile: professor.mobile},
    #     {Professor.title: professor.title.upper()},
    #     {Professor.level: professor.level},
    #     {Professor.notes: professor.notes},
    #     {Professor.creation_user: creation_user},
    #     {Professor.last_update_at: func.now()}
    # ])
    db_professor = db.query(Professor).filter(Professor.id == id).first()
    db_professor.address = professor.address.upper()
    db_professor.city = professor.city.upper()
    db_professor.zipcode = professor.zipcode
    db_professor.telephone = professor.telephone
    db_professor.office_phone = professor.office_phone
    db_professor.mobile = professor.mobile
    db_professor.title = professor.title.upper()
    db_professor.level = int(professor.level)
    db_professor.notes = professor.notes
    db_professor.creation_user = creation_user
    db.flush()
    db.commit()
    # db.refresh(db_professor)
    return db_professor

async def delete_professor_by_id(db: Session, id: int):
    db_professor = db.query(Professor).filter(Professor.id == id).first()
    db.delete(db_professor)
    db.commit()
    status = 'OK'
    return status

async def get_professor_documents(db: Session, id: int):
    return db.query(Document).filter(Document.professor_id == id).all()

async def get_professor_sections(db: Session, id: int):
    return db.query(Section).filter(Section.professor_id == id).all()