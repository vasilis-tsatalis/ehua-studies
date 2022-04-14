from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Document_Type
from ..schemas.document import DocumentCreate


async def get_documents(db: Session, skip: int = 0, limit: int = 200):
    roles = db.query(Document_Type).offset(skip).limit(limit).all()
    return roles

async def get_document_by_id(db: Session, id: int):
    return db.query(Document_Type).filter(Document_Type.id == id).first()

async def get_document_by_name(db: Session, name: str):
    return db.query(Document_Type).filter(Document_Type.name == name.upper()).first()

async def create_document(db: Session, document: DocumentCreate, creation_user: str):
    db_document = Document_Type(name=document.name.upper(), description=document.description, creation_date=datetime.datetime.utcnow, creation_user= creation_user)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

async def update_document_by_id(db: Session, id: int):
    return 'updated'

async def delete_document_by_id(db: Session, id: int):
    return 'deleted'
