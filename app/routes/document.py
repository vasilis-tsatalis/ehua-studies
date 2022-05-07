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

from ..schemas import document
from ..controllers import crud_documents
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Student main server route listener
doc_router = APIRouter(
    prefix = os.getenv("API_URL") + '/documents',
    tags=['uploaded documents']
)

@doc_router.get("/", response_model=List[document.Doc], status_code = status.HTTP_200_OK)
async def get_docs(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_docs = await crud_documents.get_docs(db, skip=skip, limit=limit)
    if db_docs:
        return db_docs
    raise HTTPException(
        status_code=404, 
        detail="Docs not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@doc_router.get("/{id}", response_model=document.Doc, status_code = status.HTTP_200_OK)
async def get_doc_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_doc = await crud_documents.get_doc_by_id(db, id=id)
    if db_doc is None:
        raise HTTPException(
            status_code=404, 
            detail="Doc not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_doc


@doc_router.get("/{filename}", response_model=document.Doc, status_code = status.HTTP_200_OK)
async def get_doc_by_filename(filename: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_doc = await crud_documents.get_doc_by_filename(db, filename=filename.upper())
    if db_doc is None:
        raise HTTPException(
            status_code=404, 
            detail="Doc filename not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_doc


@doc_router.post("/", response_model=document.Doc, status_code = status.HTTP_201_CREATED)
async def create_doc(doc: document.DocCreate, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    return await crud_documents.create_doc(db, doc=doc, creation_user=webuser)


@doc_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_doc(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@doc_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_doc(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_doc = await crud_documents.delete_doc_by_id(db, id=id)
    return db_doc
