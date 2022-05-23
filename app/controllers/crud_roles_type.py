from sqlalchemy.orm import Session
import datetime
from ..models.tables_definitions import Role_Type
from ..schemas.role_type import RoleCreate


async def get_roles(db: Session, skip: int = 0, limit: int = 200):
    roles = db.query(Role_Type).offset(skip).limit(limit).all()
    return roles

async def get_role_by_id(db: Session, id: int):
    return db.query(Role_Type).filter(Role_Type.id == id).first()

async def get_role_by_name(db: Session, name: str):
    return db.query(Role_Type).filter(Role_Type.name == name.upper()).first()

async def create_role(db: Session, role: RoleCreate, creation_user: str):
    db_role = Role_Type(name=role.name.upper(), description=role.description, creation_user= creation_user)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

async def update_role_by_id(db: Session, id: int):
    return 'updated'

async def delete_role_by_id(db: Session, id: int):
    db_role = db.query(Role_Type).filter(Role_Type.id == id).first()
    db.delete(db_role)
    db.commit()
    status = 'OK'
    return status
