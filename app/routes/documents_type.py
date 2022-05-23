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

from ..schemas import document_type
from ..controllers import crud_documents_type
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Document main server route listener
document_router = APIRouter(
    prefix = os.getenv("API_URL") + '/documents_types',
    tags=['documents']
)

@document_router.get("/", status_code = status.HTTP_200_OK)
async def get_documents_types(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_documents = await crud_documents_type.get_documents(db, skip=skip, limit=limit)
    if db_documents:
        return db_documents
    raise HTTPException(
        status_code=404, 
        detail="Documents not found",
        headers={"WWW-Authenticate": "Basic"},
        )

@document_router.get("/{id}", status_code = status.HTTP_200_OK)
async def get_documents_type_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_document = await crud_documents_type.get_document_by_id(db, id=id)
    if db_document is None:
        raise HTTPException(
            status_code=404, 
            detail="Document not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_document


@document_router.get("/name/{name}", status_code = status.HTTP_200_OK)
async def get_documents_type_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_document = await crud_documents_type.get_document_by_name(db, name=name.upper())
    if db_document is None:
        raise HTTPException(
            status_code=404, 
            detail="Document not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_document


@document_router.post("/", status_code = status.HTTP_201_CREATED)
async def create_documents_type(document: document_type.DocumentCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_document = await crud_documents_type.get_document_by_name(db, name=document.name.upper())
    if db_document:
        raise HTTPException(
            status_code=400, 
            detail="Document name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await crud_documents_type.create_document(db, document=document, creation_user=administrator)


@document_router.patch("/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_documents_type(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@document_router.delete("/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_documents_type(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    status = await crud_documents_type.delete_document_by_id(db, id=id)
    db_document = await crud_documents_type.get_document_by_id(db, id=id)
    if db_document is None:
        return {'message': status}
    raise HTTPException(
        status_code=501, 
        detail="Document Type not deleted",
        headers={"WWW-Authenticate": "Basic"},
        )