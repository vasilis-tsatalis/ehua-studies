#!/usr/bin/python

from fastapi import FastAPI
import os

# Import separated routes
from .routes.home import home_router
from .routes.user import user_router
from .routes.student import student_router
from .routes.professor import professor_router
from .routes.document import doc_router
from .routes.course import course_router
from .routes.department import department_router
from .routes.section import section_router
from .routes.roles_type import role_router
from .routes.schedulers_type import schedule_router
from .routes.exams_type import exam_router
from .routes.semesters_type import semester_router
from .routes.documents_type import document_router
from .routes.classrooms_type import classroom_router

from .config.database import SessionLocal, engine
from .models import tables_definitions

from dotenv import load_dotenv
load_dotenv()

description = """
EHUA-Studies Portal helps you do awesome stuff. 🚀 \n

## Admin Officer Actions
* **CRUD Classrooms Types**
* **CRUD Courses**
* **CRUD Departments**
* **CRUD Documents**
* **CRUD Documents Types**
* **CRUD Exams Types**
* **CRUD Professors**
* **CRUD Roles Types**
* **CRUD Schedulers Types**
* **CRUD Sections**
* **CRUD Semesters Types**
* **CRUD Students**

## Web User Frontend Actions
* **Read Classrooms Types**
* **Read Courses**
* **Read Departments**
* **Read - Create Documents**
* **Read Documents Types**
* **Read Exams Types**
* **Read Professors**
* **Read Roles Types**
* **Read Schedulers Types**
* **Read - Add Sections**
* **Read Semesters Types**
* **Read Students**

"""


# Create - Initialize Database Tables
tables_definitions.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title = "eHUA studies portal",
    description = description,
    version = "1.0",
    openapi_url = os.getenv("API_URL") + '/openapi.json',
    docs_url = os.getenv("API_URL") + '/documentation', 
    redoc_url = os.getenv("API_URL") + '/redocs',
    terms_of_service = "https://github.com/vasilis-tsatalis/ehua-studies.git",
    contact={
        "name": "Vasilis Tsatalis",
        "email": "itp20138@hua.gr",
    },
    license_info={
        "name": "MIT License",
        "url": "https://www.mit.edu/~amini/LICENSE.md",
    },
)

# API Default page
app.include_router(home_router)
# Authentication User routes
app.include_router(user_router)
# Main Routes of API
app.include_router(student_router)
app.include_router(professor_router)
app.include_router(course_router)
app.include_router(department_router)
app.include_router(section_router)
app.include_router(doc_router)
# tables
app.include_router(role_router)
app.include_router(schedule_router)
app.include_router(exam_router)
app.include_router(semester_router)
app.include_router(document_router)
app.include_router(classroom_router)
