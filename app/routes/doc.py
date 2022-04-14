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

from ..schemas import doc
from ..controllers import docs
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Student main server route listener
doc_router = APIRouter(
    prefix = os.getenv("API_URL"),
    tags=['uploaded documents']
)

@doc_router.get("/docs", response_model=List[doc.Doc], status_code = status.HTTP_200_OK)
async def get_docs(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_docs = await docs.get_docs(db, skip=skip, limit=limit)
    if db_docs:
        return db_docs
    raise HTTPException(
        status_code=404, 
        detail="Docs not found",
        headers={"WWW-Authenticate": "Basic"},
        )


@doc_router.get("/docs/{id}", response_model=doc.Doc, status_code = status.HTTP_200_OK)
async def get_doc_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_doc = await docs.get_doc_by_id(db, id=id)
    if db_doc is None:
        raise HTTPException(
            status_code=404, 
            detail="Doc not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_doc


@doc_router.get("/docs/{filename}", response_model=doc.Doc, status_code = status.HTTP_200_OK)
async def get_doc_by_filename(filename: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_doc = await docs.get_doc_by_filename(db, filename=filename.upper())
    if db_doc is None:
        raise HTTPException(
            status_code=404, 
            detail="Doc filename not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_doc


@doc_router.post("/docs", response_model=doc.Doc, status_code = status.HTTP_201_CREATED)
async def create_doc(doc: doc.DocCreate, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    return await docs.create_doc(db, doc=doc, creation_user=webuser)


@doc_router.patch("/docs/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_doc(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@doc_router.delete("/docs/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_doc(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
