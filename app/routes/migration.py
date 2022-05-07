from fastapi import APIRouter, status, File, UploadFile, Depends, HTTPException
from fastapi import APIRouter
from fastapi.security import HTTPBasic
from sqlalchemy.orm import Session
import os
import shutil
import pathlib

# include other functionality
from ..auth.authentication import authenticate_admin
from ..config.database import get_db
from ..migration.insert_admin_data import read_file

from dotenv import load_dotenv
load_dotenv()

security = HTTPBasic()

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Migration server route listener
migration_router = APIRouter(
    prefix = os.getenv("API_URL") + '/migration',
    tags=['Migration Files']
)

@migration_router.post("/", status_code = status.HTTP_200_OK)
async def general_migration(file: UploadFile = File(...), administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):

    if not file:
        return HTTPException(
        status_code=404, 
        detail="There is no file", 
        headers={"WWW-Authenticate": "Basic"},
        )
    read_file('./data/roles_types.json')
    return {'msg':'ok'}
