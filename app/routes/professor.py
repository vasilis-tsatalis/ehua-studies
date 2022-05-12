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

from ..schemas import professor, document
from ..controllers import crud_professors, crud_documents, crud_sections
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# professor main server route listener
professor_router = APIRouter(
    prefix = os.getenv("API_URL") + '/professors',
    tags=['professors']
)

@professor_router.get("/", response_model=List[professor.Professor], status_code = status.HTTP_200_OK)
async def get_professors(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_professors = await crud_professors.get_professors(db, skip=skip, limit=limit)
    if db_professors:
        return db_professors
    raise HTTPException(
        status_code=404, 
        detail="Professors not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@professor_router.get("/{id}", response_model=professor.Professor, status_code = status.HTTP_200_OK)
async def get_professor_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_professor = await crud_professors.get_professor_by_id(db, id=id)
    if db_professor is None:
        raise HTTPException(
            status_code=404, 
            detail="Professor not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_professor


@professor_router.get("/{username}", response_model=professor.Professor, status_code = status.HTTP_200_OK)
async def get_professor_by_username(username: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_professor = await crud_professors.get_professor_by_username(db, username=username.upper())
    if db_professor is None:
        raise HTTPException(
            status_code=404, 
            detail="Professor not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_professor


@professor_router.post("/", response_model=professor.Professor, status_code = status.HTTP_201_CREATED)
async def create_professor(professor: professor.ProfessorCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_professor = await crud_professors.get_professor_by_username(db, username=professor.username.upper())
    if db_professor:
        raise HTTPException(
            status_code=400, 
            detail="professor username already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_professors.create_professor(db, professor=professor, creation_user=administrator)


@professor_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_professor(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@professor_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_professor(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_professors.delete_professor_by_id(db, id=id)
    db_professor = await crud_professors.get_professor_by_id(db, id=id)
    if db_professor is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Professor not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )

@professor_router.get("/{id}/documents", status_code = status.HTTP_200_OK)
async def get_professor_documents_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_professor = await crud_professors.get_professor_by_id(db, id=id)
    if db_professor is None:
        raise HTTPException(
            status_code=404, 
            detail="Professor not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    db_documents = await crud_professors.get_professor_documents(db, id=id)

    if db_documents:
        professor_documents = []

        for document in db_documents:
            the_document = crud_documents.get_doc_by_id(db, id=document.id)
            professor_documents.append(the_document)

        return professor_documents

    else:
        raise HTTPException(
            status_code=404, 
            detail="No Professor documents found",
            headers={"WWW-Authenticate": "Basic"},
            )


@professor_router.get("/{id}/sections", status_code = status.HTTP_200_OK)
async def get_professor_sections_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_professor = await crud_professors.get_professor_by_id(db, id=id)
    if db_professor is None:
        raise HTTPException(
            status_code=404, 
            detail="Professor not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    db_sections = await crud_professors.get_professor_sections(db, id=id)

    if db_sections:
        professor_sections = []

        for section in db_sections:
            the_section = crud_sections.get_section_by_id(db, id=section.id)
            professor_sections.append(the_section)

        return professor_sections

    else:
        raise HTTPException(
            status_code=404, 
            detail="No Professor sections found",
            headers={"WWW-Authenticate": "Basic"},
            )
