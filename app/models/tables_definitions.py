from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, VARCHAR, TIMESTAMP, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy_utils import EmailType
from ..config.database import Base
import datetime

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# DATABASE MODELS - TABLES AND RELATIONSHIPS
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Association tables relationships (Many to Many)

association_table_students_sections = Table('students_sections', Base.metadata,
    Column('student_id', ForeignKey('student.id'), primary_key=True),
    Column('section_id', ForeignKey('section.id'), primary_key=True),
    Column('status', Integer),
    Column('results', String(10)),
    Column('last_update_at', TIMESTAMP, server_default=func.now())
)


association_table_sections_schedules = Table('sections_schedules', Base.metadata,
    Column('section_id', ForeignKey('section.id'), primary_key=True),
    Column('scheduler_type_id', ForeignKey('scheduler_type.id'), primary_key=True),
    Column('last_update_at', TIMESTAMP, server_default=func.now())
)


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Role class model in database - static
class Role_Type(Base):
    __tablename__ = "role_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    creation_user = Column(String) # Admin
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Classroom class model in database - static
class Classroom_Type(Base):
    __tablename__ = "classroom_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    building = Column(String)
    number = Column(String)
    type = Column(String)
    creation_user = Column(String) # Admin
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # one-many, many-one
    sections = relationship("Section", back_populates="classroom_type")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Exam class model in database - static
class Exam_Type(Base):
    __tablename__ = "exam_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    gravity = Column(String)
    creation_user = Column(String) # Admin
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # one-many, many-one
    sections = relationship("Section", back_populates="exam_type")

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Scheduler class model in database - static
class Scheduler_Type(Base):
    __tablename__ = "scheduler_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    day = Column(String)
    start_time = Column(String)
    end_time = Column(String)
    creation_user = Column(String) # Admin
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # many-many
    sections = relationship("Section", secondary=association_table_sections_schedules, back_populates="scheduler_types")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Semester class model in database - static
class Semester_Type(Base):
    __tablename__ = "semester_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    start_time = Column(TIMESTAMP)
    days_time = Column(TIMESTAMP)
    creation_user = Column(String) # Admin
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # one-one Parent.child
    course = relationship("Course", back_populates="semester_type", uselist=False)

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Document class model in database
class Document_Type(Base):
    __tablename__ = "document_type"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    creation_user = Column(String) # Admin
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # one-many, many-one
    documents = relationship("Document", back_populates="document_type")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Student class model in database
class Student(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    # hashed_password = Column(String)
    first_name = Column(VARCHAR(100))
    last_name = Column(VARCHAR(100))
    date_of_birth = Column(VARCHAR(10))
    address = Column(String)
    city = Column(String)
    zipcode = Column(String(10))
    telephone = Column(String(30))
    phone = Column(String(30))
    mobile = Column(String(30))
    email = Column(EmailType, unique=True, index=True)
    year_group = Column(Integer)
    is_active = Column(Boolean, default=True)
    notes = Column(Text)
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # many-many
    sections = relationship("Section", secondary=association_table_students_sections, back_populates="students")

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Student class model in database
class Professor(Base):
    __tablename__ = "professor"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    # hashed_password = Column(String)
    first_name = Column(VARCHAR(100))
    last_name = Column(VARCHAR(100))
    date_of_birth = Column(VARCHAR(10))
    address = Column(String)
    city = Column(String)
    zipcode = Column(String(10))
    telephone = Column(String(30))
    office_phone = Column(String(30))
    mobile = Column(String(30))
    email = Column(EmailType, unique=True, index=True)
    title = Column(String)
    level = Column(String)
    is_active = Column(Boolean, default=True)
    notes = Column(Text)
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # one-many, many-one
    documents = relationship("Document", back_populates="professor")
    # one-many, many-one
    sections = relationship("Section", back_populates="professor")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Department class model in database
class Department(Base):
    __tablename__ = "department"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(VARCHAR(20), unique=True, nullable=False)
    description = Column(Text)
    points = Column(String(10))
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # one-many, many-one
    courses = relationship("Course", back_populates="department")

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Document class model in database
class Document(Base):
    __tablename__ = "document"

    professor_id = Column(Integer, ForeignKey("professor.id"))
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True) # document name in the bucket
    document_type_id = Column(Integer, ForeignKey("document_type.id"))
    url = Column(String(255))
    bucket = Column(String)
    filename = Column(VARCHAR(100)) # extension included - user upload
    extension = Column(String(10))
    expiration_days = Column(Integer)
    notes = Column(Text)
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # many-one, one-many
    professor = relationship("Professor", back_populates="documents")
    # many-one, one-many
    document_type = relationship("Document_Type", back_populates="documents")

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Course class model in database
class Course(Base):
    __tablename__ = "course"

    department_id = Column(Integer, ForeignKey("department.id"))
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    semester_type_id = Column(Integer, ForeignKey("semester_type.id"))
    gravity = Column(String)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # many-one, one-many
    department = relationship("Department", back_populates="courses")
    # one-one (many-one)
    semester_type = relationship("Semester_Type", back_populates="course")
    # one-many, many-one
    sections = relationship("Section", back_populates="course")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Section class model in database
class Section(Base):
    __tablename__ = "section"

    course_id = Column(Integer, ForeignKey('course.id'))
    id = Column(Integer, primary_key=True, index=True)
    professor_id = Column(Integer, ForeignKey('professor.id'))
    classroom_type_id = Column(Integer, ForeignKey('classroom_type.id'))
    year = Column(String(10))
    exam_type_id = Column(Integer, ForeignKey("exam_type.id"), nullable=True)
    last_update_at = Column(TIMESTAMP, server_default=func.now())

    # many-many
    students = relationship("Student", secondary=association_table_students_sections, back_populates="sections")
    # many-one, one-many
    professor = relationship("Professor", back_populates="sections")
    # many-one, one-many
    course = relationship("Course", back_populates="sections")
    # many-one, one-many
    classroom_type = relationship("Classroom_Type", back_populates="sections")
    # many-many
    scheduler_types = relationship("Scheduler_Type", secondary=association_table_sections_schedules, back_populates="sections")
    # many-one, one-many
    exam_type = relationship("Exam_Type", back_populates="sections")


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #