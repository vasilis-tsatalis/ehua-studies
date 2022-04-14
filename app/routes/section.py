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

from ..schemas import section
from ..controllers import sections
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Section main server route listener
section_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['sections']
)


@section_router.get("/sections", response_model=List[section.Section], status_code = status.HTTP_200_OK)
async def get_sections(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_sections = await sections.get_sections(db, skip=skip, limit=limit)
    if db_sections:
        return db_sections
    raise HTTPException(
        status_code=404, 
        detail="Sections not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@section_router.get("/sections/{id}", response_model=section.Section, status_code = status.HTTP_200_OK)
async def get_section_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_section = await sections.get_professor_by_id(db, id=id)
    if db_section is None:
        raise HTTPException(
            status_code=404, 
            detail="Section not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_section


@section_router.post("/sections", response_model=section.Section, status_code = status.HTTP_201_CREATED)
async def create_section(section: section.SectionCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return await sections.create_section(db, section=section)


@section_router.patch("/sections/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_section(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@section_router.delete("/sections/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_section(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
