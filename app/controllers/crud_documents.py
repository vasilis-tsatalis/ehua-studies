from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Document
from ..schemas.document import DocCreate


async def get_docs(db: Session, skip: int = 0, limit: int = 200):
    db_docs = db.query(Document).offset(skip).limit(limit).all()
    return db_docs

async def get_doc_by_id(db: Session, id: int):
    return db.query(Document).filter(Document.id == id).first()

async def get_doc_by_filename(db: Session, filename: str):
    return db.query(Document).filter(Document.filename == filename.upper()).first()

async def create_doc(db: Session, doc: DocCreate, creation_user: str):
    db_doc = Document(
        professor_id=doc.professor_id, 
        document_type_id=doc.document_type_id,
        name=doc.name.upper(),
        bucket=doc.bucket, 
        filename=doc.filename.upper(),
        notes=doc.notes,
        extension=doc.extension,
        url=doc.url,
        expiration_days=doc.expiration_days,
        creation_user= creation_user)
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

async def update_doc_by_id(db: Session, id: int):
    return 'updated'

async def delete_doc_by_id(db: Session, id: int):
    db_doc = db.query(Document).filter(Document.id == id).first()
    db.delete(db_doc)
    db.commit()
    status = 'OK'
    return status
