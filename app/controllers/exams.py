from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Exam_Type
from ..schemas.exam import ExamCreate


async def get_exams(db: Session, skip: int = 0, limit: int = 200):
    exams = db.query(Exam_Type).offset(skip).limit(limit).all()
    return exams

async def get_exam_by_id(db: Session, id: int):
    return db.query(Exam_Type).filter(Exam_Type.id == id).first()

async def get_exam_by_name(db: Session, name: str):
    return db.query(Exam_Type).filter(Exam_Type.name == name.upper()).first()

async def create_exam(db: Session, exam: ExamCreate, creation_user: str):
    db_exam = Exam_Type(name=exam.name.upper(), gravity=exam.gravity, creation_date=datetime.datetime.utcnow, creation_user= creation_user)
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

async def update_exam_by_id(db: Session, id: int):
    return 'updated'

async def delete_exam_by_id(db: Session, id: int):
    return 'deleted'
