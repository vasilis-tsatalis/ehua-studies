from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Scheduler_Type
from ..schemas.schedule import SchedulerCreate


async def get_schedules(db: Session, skip: int = 0, limit: int = 200):
    schedules = db.query(Scheduler_Type).offset(skip).limit(limit).all()
    return schedules

async def get_schedule_by_id(db: Session, id: int):
    return db.query(Scheduler_Type).filter(Scheduler_Type.id == id).first()

async def get_schedule_by_name(db: Session, name: str):
    return db.query(Scheduler_Type).filter(Scheduler_Type.name == name.upper()).first()

async def create_schedule(db: Session, schedule: SchedulerCreate, creation_user: str):
    db_schedule = Scheduler_Type(name=schedule.name.upper(), day=schedule.day, start_time=schedule.start_time, end_time=schedule.end_time, creation_date=datetime.datetime.utcnow, creation_user= creation_user)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

async def update_schedule_by_id(db: Session, id: int):
    return 'updated'

async def delete_schedule_by_id(db: Session, id: int):
    return 'deleted'
