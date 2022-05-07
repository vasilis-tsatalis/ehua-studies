from fastapi import Depends, status, Request, HTTPException
from fastapi import APIRouter
from fastapi.security import HTTPBasic
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv
load_dotenv()

from ..auth.authentication import authenticate_admin, authenticate_webuser
security = HTTPBasic()

from ..schemas import scheduler_type
from ..controllers import crud_schedulers_type
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Scheduler main server route listener
schedule_router = APIRouter(
    prefix = os.getenv("API_URL") + '/schedulers_types',
    tags=['schedules']
)

@schedule_router.get("/", response_model=List[scheduler_type.Scheduler], status_code = status.HTTP_200_OK)
async def get_schedules(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_schedules = await crud_schedulers_type.get_schedules(db, skip=skip, limit=limit)
    if db_schedules:
        return db_schedules
    raise HTTPException(
        status_code=404, 
        detail="Schedules not found",
        headers={"WWW-Authenticate": "Basic"},
        )

@schedule_router.get("/{id}", response_model=scheduler_type.Scheduler, status_code = status.HTTP_200_OK)
async def get_schedule_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_schedule = await crud_schedulers_type.get_schedule_by_id(db, id=id)
    if db_schedule is None:
        raise HTTPException(
            status_code=404, 
            detail="Scheduler not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_schedule


@schedule_router.get("/{day}", response_model=scheduler_type.Scheduler, status_code = status.HTTP_200_OK)
async def get_schedule_by_day(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_schedule = await crud_schedulers_type.get_schedule_by_name(db, name=name.upper())
    if db_schedule is None:
        raise HTTPException(
            status_code=404, 
            detail="Scheduler not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_schedule


@schedule_router.post("/", response_model=scheduler_type.Scheduler, status_code = status.HTTP_201_CREATED)
async def create_schedule(schedule: scheduler_type.SchedulerCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_schedule = await crud_schedulers_type.get_schedule_by_name(db, name=schedule.name.upper())
    if db_schedule:
        raise HTTPException(
            status_code=400, 
            detail="Scheduler name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_schedulers_type.create_schedule(db, schedule=schedule, creation_user=administrator)


@schedule_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_schedule(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@schedule_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_schedule(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_scheduler = await crud_schedulers_type.delete_scheduler_by_id(db, id=id)
    return db_scheduler
