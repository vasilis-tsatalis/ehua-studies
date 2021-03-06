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

from ..schemas import classroom_type
from ..controllers import crud_classrooms_type
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Classroom main server route listener
classroom_router = APIRouter(
    prefix = os.getenv("API_URL") + '/classrooms_types',
    tags=['classroom types']
)

@classroom_router.get("/", status_code = status.HTTP_200_OK)
async def get_classrooms_types(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_classrooms = await crud_classrooms_type.get_classrooms(db, skip=skip, limit=limit)
    if db_classrooms:
        return db_classrooms
    raise HTTPException(
        status_code=404, 
        detail="Classrooms not found",
        headers={"WWW-Authenticate": "Basic"},
        )
        

@classroom_router.get("/{id}", status_code = status.HTTP_200_OK)
async def get_classrooms_type_by_id(id:int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_classroom = await crud_classrooms_type.get_classroom_by_id(db, id=id)
    if db_classroom is None:
        raise HTTPException(
            status_code=404, 
            detail="Classroom not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_classroom


@classroom_router.get("/name/{name}", status_code = status.HTTP_200_OK)
async def get_classrooms_type_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_classroom = await crud_classrooms_type.get_classroom_by_name(db, name=name.upper())
    if db_classroom is None:
        raise HTTPException(
            status_code=404, 
            detail="Classroom not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_classroom


@classroom_router.post("/", status_code = status.HTTP_201_CREATED)
async def create_classrooms_type(classroom: classroom_type.ClassroomCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_classroom = await crud_classrooms_type.get_classroom_by_name(db, name=classroom.name.upper())
    if db_classroom:
        raise HTTPException(
            status_code=400, 
            detail="Classroom name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_classrooms_type.create_classroom(db, classroom=classroom, creation_user=administrator)


@classroom_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_classrooms_type(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@classroom_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_classrooms_type(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_classrooms_type.delete_classroom_by_id(db, id=id)
    db_classroom = await crud_classrooms_type.get_classroom_by_id(db, id=id)
    if db_classroom is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Classroom not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )
        
