from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Professor, Document, Section
from ..schemas.professor import ProfessorCreate


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
        creation_date=datetime.datetime.utcnow, 
        creation_user= creation_user)
    db.add(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor

async def update_professor_by_id(db: Session, id: int):
    return 'updated'

async def delete_professor_by_id(db: Session, id: int):
    db_professor = Professor.query.filter_by(id=id).one()
    db.delete(db_professor)
    db.commit()
    db.refresh(db_professor)
    return db_professor

async def get_professor_documents(db: Session, id: int):
    return db.query(Document).filter(Document.professor_id == id).all()

async def get_professor_sections(db: Session, id: int):
    return db.query(Section).filter(Section.professor_id == id).all()