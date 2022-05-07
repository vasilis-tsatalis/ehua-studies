from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Classroom_Type
from ..schemas.classroom_type import ClassroomCreate


async def get_classrooms(db: Session, skip: int = 0, limit: int = 200):
    classrooms = db.query(Classroom_Type).offset(skip).limit(limit).all()
    return classrooms

async def get_classroom_by_id(db: Session, id: int):
    return db.query(Classroom_Type).filter(Classroom_Type.id == id).first()

async def get_classroom_by_name(db: Session, name: str):
    return db.query(Classroom_Type).filter(Classroom_Type.name == name.upper()).first()

async def create_classroom(db: Session, classroom: ClassroomCreate, creation_user: str):
    db_classroom = Classroom_Type(name=classroom.name.upper(), building=classroom.building, type=classroom.type, creation_date=datetime.datetime.utcnow, creation_user= creation_user)
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

async def update_classroom_by_id(db: Session, id: int):
    return 'updated'

async def delete_classroom_by_id(db: Session, id: int):
    db_classroom = Classroom_Type.query.filter_by(id=id).one()
    db.delete(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom
