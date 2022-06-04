from sqlalchemy.orm import Session
import datetime
from sqlalchemy.sql import func
from ..models.tables_definitions import Sections_Schedulers
from ..schemas.section_scheduler import Section_Scheduler_Create


async def get_sections_schedulers(db: Session, skip: int = 0, limit: int = 200):
    sections_schedulers = db.query(Sections_Schedulers).offset(skip).limit(limit).all()
    return sections_schedulers

async def get_sections_per_scheduler_id(db: Session, scheduler_id: int):
    return db.query(Sections_Schedulers).filter(Sections_Schedulers.scheduler_type_id == scheduler_id).first()

async def get_schedulers_per_section_id(db: Session, section_id: int):
    return db.query(Sections_Schedulers).filter(Sections_Schedulers.section_id == section_id).first()


async def create_sections_schedulers(db: Session, section_scheduler: Section_Scheduler_Create, creation_user: str):
    db_section_scheduler = Sections_Schedulers(
        section_id=section_scheduler.section_id, 
        scheduler_type_id=section_scheduler.scheduler_type_id,
        creation_user= creation_user)
    db.add(db_section_scheduler)
    db.commit()
    db.refresh(db_section_scheduler)
    return db_section_scheduler


async def unlink_sections_by_scheduler_id(db: Session, id: int):
    db_scheduler = db.query(Sections_Schedulers).filter(Sections_Schedulers.scheduler_type_id == id).all()
    db.delete(db_scheduler)
    db.commit()
    status = 'OK'
    return status

async def unlink_schedulers_by_section_id(db: Session, id: int):
    db_section = db.query(Sections_Schedulers).filter(Sections_Schedulers.section_id == id).all()
    db.delete(db_section)
    db.commit()
    status = 'OK'
    return status
