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

from ..schemas import professor
from ..controllers import professors
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# professor main server route listener
professor_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['professors']
)

@professor_router.get("/professors", response_model=List[professor.Professor], status_code = status.HTTP_200_OK)
async def get_professors(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_professors = await professors.get_professors(db, skip=skip, limit=limit)
    if db_professors:
        return db_professors
    raise HTTPException(
        status_code=404, 
        detail="Professors not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@professor_router.get("/professors/{id}", response_model=professor.Professor, status_code = status.HTTP_200_OK)
async def get_professor_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_professor = await professors.get_professor_by_id(db, id=id)
    if db_professor is None:
        raise HTTPException(
            status_code=404, 
            detail="Professor not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_professor


@professor_router.get("/professors/{username}", response_model=professor.Professor, status_code = status.HTTP_200_OK)
async def get_professor_by_username(username: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_professor = await professors.get_professor_by_username(db, username=username.upper())
    if db_professor is None:
        raise HTTPException(
            status_code=404, 
            detail="Professor not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_professor


@professor_router.post("/professors", response_model=professor.Professor, status_code = status.HTTP_201_CREATED)
async def create_professor(professor: professor.ProfessorCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_professor = await professors.get_professor_by_username(db, username=professor.username.upper())
    if db_professor:
        raise HTTPException(
            status_code=400, 
            detail="professor username already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await professors.create_professor(db, professor=professor, creation_user=administrator)


@professor_router.patch("/professors/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_professor(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@professor_router.delete("/professors/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_professor(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
