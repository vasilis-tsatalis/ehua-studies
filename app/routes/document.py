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
from ..controllers import documents
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Document main server route listener
document_router = APIRouter(
    prefix = os.getenv("API_URL") + '/type',
    tags=['documents']
)

@document_router.get("/documents", response_model=List[document.Document], status_code = status.HTTP_200_OK)
async def get_documents(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_documents = await documents.get_documents(db, skip=skip, limit=limit)
    if db_documents:
        return db_documents
    raise HTTPException(
        status_code=404, 
        detail="Documents not found",
        headers={"WWW-Authenticate": "Basic"},
        )

@document_router.get("/documents/{id}", response_model=document.Document, status_code = status.HTTP_200_OK)
async def get_document_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_document = await documents.get_document_by_id(db, id=id)
    if db_document is None:
        raise HTTPException(
            status_code=404, 
            detail="Document not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_document


@document_router.get("/documents/{name}", response_model=document.Document, status_code = status.HTTP_200_OK)
async def get_document_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_document = await documents.get_document_by_name(db, name=name.upper())
    if db_document is None:
        raise HTTPException(
            status_code=404, 
            detail="Document not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_document


@document_router.post("/documents", response_model=document.Document, status_code = status.HTTP_201_CREATED)
async def create_document(document: document.DocumentCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_document = await documents.get_document_by_name(db, name=document.name.upper())
    if db_document:
        raise HTTPException(
            status_code=400, 
            detail="Document name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await documents.create_document(db, document=document, creation_user=administrator)


@document_router.patch("/documents/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_document(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@document_router.delete("/documents/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_document(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
