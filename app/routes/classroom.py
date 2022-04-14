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

from ..schemas import classroom
from ..controllers import classrooms
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Classroom main server route listener
classroom_router = APIRouter(
    prefix = os.getenv("API_URL") + '/type',
    tags=['classrooms']
)

@classroom_router.get("/classrooms", esponse_model=List[classroom.Classroom], status_code = status.HTTP_200_OK)
async def get_classrooms(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_classrooms = await classrooms.get_classrooms(db, skip=skip, limit=limit)
    if db_classrooms:
        return db_classrooms
    raise HTTPException(
        status_code=404, 
        detail="Classrooms not found",
        headers={"WWW-Authenticate": "Basic"},
        )
        

@classroom_router.get("/classrooms/{id}", status_code = status.HTTP_200_OK)
async def get_classroom_by_id(id:int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_classroom = await classrooms.get_classroom_by_id(db, id=id)
    if db_classroom is None:
        raise HTTPException(
            status_code=404, 
            detail="Classroom not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_classroom


@classroom_router.get("/classrooms/{name}", response_model=classroom.Classroom, status_code = status.HTTP_200_OK)
async def get_classroom_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_classroom = await classrooms.get_classroom_by_name(db, name=name.upper())
    if db_classroom is None:
        raise HTTPException(
            status_code=404, 
            detail="Classroom not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_classroom


@classroom_router.post("/classrooms", response_model=classroom.Classroom, status_code = status.HTTP_201_CREATED)
async def create_classroom(classroom: classroom.ClassroomCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_classroom = await classrooms.get_classroom_by_name(db, name=classroom.name.upper())
    if db_classroom:
        raise HTTPException(
            status_code=400, 
            detail="Classroom name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await classrooms.create_classroom(db, classroom=classroom, creation_user=administrator)


@classroom_router.patch("/classrooms/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_classroom(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@classroom_router.delete("/classrooms/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_classroom(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
