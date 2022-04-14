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

from ..schemas import exam
from ..controllers import exams
from ..config.database import get_db

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Exam main server route listener
exam_router = APIRouter(
    prefix = os.getenv("API_URL") + '/type',
    tags=['exams']
)

@exam_router.get("/exams", response_model=List[exam.Exam], status_code = status.HTTP_200_OK)
async def get_exams(webuser: str = Depends(authenticate_webuser), skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    db_exams = await exams.get_exams(db, skip=skip, limit=limit)
    if db_exams:
        return db_exams
    raise HTTPException(
        status_code=404, 
        detail="Exams not found",
        headers={"WWW-Authenticate": "Basic"},
        )

@exam_router.get("/exams/{id}", response_model=exam.Exam, status_code = status.HTTP_200_OK)
async def get_exam_by_id(id: int, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_exam = await exams.get_exam_by_id(db, id=id)
    if db_exam is None:
        raise HTTPException(
            status_code=404, 
            detail="Exam not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_exam


@exam_router.get("/exams/{name}", response_model=exam.Exam, status_code = status.HTTP_200_OK)
async def get_exam_by_name(name: str, webuser: str = Depends(authenticate_webuser), db: Session = Depends(get_db)):
    db_exam = await exams.get_exam_by_name(db, name=name.upper())
    if db_exam is None:
        raise HTTPException(
            status_code=404, 
            detail="Exam not found",
            headers={"WWW-Authenticate": "Basic"},
            )
    return db_exam


@exam_router.post("/exams", response_model=exam.Exam, status_code = status.HTTP_201_CREATED)
async def create_exam(exam: exam.ExamCreate, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    db_exam = await exams.get_exam_by_name(db, name=exam.name.upper())
    if db_exam:
        raise HTTPException(
            status_code=400, 
            detail="Exam name already existing", 
            headers={"WWW-Authenticate": "Basic"},
        )
    return await exams.create_exam(db, exam=exam, creation_user=administrator)


@exam_router.patch("/exams/{id}", status_code = status.HTTP_202_ACCEPTED)
async def update_exam(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}


@exam_router.delete("/exams/{id}", status_code = status.HTTP_205_RESET_CONTENT)
async def delete_exam(id: int, administrator: str = Depends(authenticate_admin), db: Session = Depends(get_db)):
    return {'id': id}
