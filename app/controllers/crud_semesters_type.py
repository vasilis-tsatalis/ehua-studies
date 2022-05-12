from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Semester_Type
from ..schemas.semester_type import SemesterCreate


async def get_semesters(db: Session, skip: int = 0, limit: int = 200):
    semesters = db.query(Semester_Type).offset(skip).limit(limit).all()
    return semesters

async def get_semester_by_id(db: Session, id: int):
    return db.query(Semester_Type).filter(Semester_Type.id == id).first()

async def get_semester_by_name(db: Session, name: str):
    return db.query(Semester_Type).filter(Semester_Type.name == name.upper()).first()

async def create_semester(db: Session, semester: SemesterCreate, creation_user: str):
    db_semester = Semester_Type(name=semester.name.upper(), description=semester.description, start_time=semester.start_time, end_time=semester.end_time, days_time=semester.days_time, creation_date=datetime.datetime.utcnow, creation_user= creation_user)
    db.add(db_semester)
    db.commit()
    db.refresh(db_semester)
    return db_semester

async def update_semester_by_id(db: Session, id: int):
    return 'updated'

async def delete_semester_by_id(db: Session, id: int):
    db_semester = db.query(Semester_Type).filter(Semester_Type.id == id).first()
    db.delete(db_semester)
    db.commit()
    status = 'OK'
    return status
    