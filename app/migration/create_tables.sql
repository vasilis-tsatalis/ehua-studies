BEGIN;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--------------------------------------------------
--------------------------------------------------
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  
  id uuid DEFAULT uuid_generate_v4 (),
  username varchar(20) UNIQUE NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  hashed_password varchar(255) NOT NULL,
  first_name varchar(150) NOT NULL,
  last_name varchar(150) NOT NULL,
  is_enabled boolean,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  
  id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  dob varchar(10),
  phone varchar(30),
  mobile varchar(30),
  address varchar(150),
  gender varchar(15),
  tin varchar(20),
  date_of_join TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(users_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS professors (
  
  id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  dob varchar(10),
  phone varchar(30),
  mobile varchar(30),  
  address varchar(150),
  gender varchar(15),
  tin varchar(20),
  research_field varchar(100),
  position int,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(users_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
  
  id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  subject varchar(100),
  body text,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(users_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (

  id uuid DEFAULT uuid_generate_v4 (),
  name varchar(20) UNIQUE NOT NULL,
  description varchar(255),
  level varchar(10),
  is_enabled boolean,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS semester_types (

  id uuid DEFAULT uuid_generate_v4 (),
  name varchar(20) UNIQUE NOT NULL,
  description varchar(255),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  
  id uuid DEFAULT uuid_generate_v4 (),
  department_id uuid NOT NULL,
  semester_type_id uuid NOT NULL,
  name varchar(20) UNIQUE NOT NULL,
  description varchar(255) NOT NULL,
  grade varchar(5) NOT NULL,
  is_enabled boolean,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_course FOREIGN KEY (department_id) REFERENCES courses(department_id),
  CONSTRAINT fk_course FOREIGN KEY (semester_type_id) REFERENCES semester_types(semester_type_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS classrooms (
  
  id uuid DEFAULT uuid_generate_v4 (),
  course_id uuid NOT NULL,
  professor_id uuid NOT NULL,
  section varchar(2),
  day varchar(10) NOT NULL,
  time varchar(10) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_classroom FOREIGN KEY (course_id) REFERENCES courses(course_id),
  CONSTRAINT fk_classroom FOREIGN KEY (professor_id) REFERENCES professors(professor_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS exams_types (

  id uuid DEFAULT uuid_generate_v4 (),
  name varchar(20) UNIQUE NOT NULL,
  description varchar(255),
  is_enabled boolean,  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
  
  id uuid DEFAULT uuid_generate_v4 (),
  exam_type_id uuid NOT NULL,
  course_id uuid NOT NULL,
  professor_id uuid NOT NULL,
  start_date date,
  end_date date,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_exam FOREIGN KEY (exam_type_id) REFERENCES exam_types(exam_type_id),
  CONSTRAINT fk_exam FOREIGN KEY (course_id) REFERENCES courses(course_id),  
  CONSTRAINT fk_exam FOREIGN KEY (professor_id) REFERENCES professors(professor_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS exams_results (
  
  id uuid DEFAULT uuid_generate_v4 (),
  exams_id uuid NOT NULL,
  student_id uuid NOT NULL,
  grade varchar(2),
  status varchar(10),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_exam FOREIGN KEY (exams_id) REFERENCES exams(exams_id),
  CONSTRAINT fk_exam FOREIGN KEY (student_id) REFERENCES students(student_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS document_types (

  id uuid DEFAULT uuid_generate_v4 (),
  name varchar(20) UNIQUE NOT NULL,
  description varchar(255),
  is_enabled boolean,  
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
  
  id uuid DEFAULT uuid_generate_v4 (),
  document_type_id uuid NOT NULL,
  user_id uuid NOT NULL,
  name varchar(20) UNIQUE NOT NULL,
  format varchar(5),
  bucket varchar(100),
  object_name varchar(50),
  presignedUrl varchar(255),
  creation_date date,
  expiration_date date,
  status boolean,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id),
  CONSTRAINT fk_document FOREIGN KEY (document_type_id) REFERENCES document_types(document_type_id),
  CONSTRAINT fk_document FOREIGN KEY (user_id) REFERENCES users(user_id)
);
--------------------------------------------------
--------------------------------------------------
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (

  classroom_id uuid NOT NULL,
  student_id uuid NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  participate boolean,
  PRIMARY KEY (classroom_id, student_id),
  FOREIGN KEY (student_id)
      REFERENCES students (student_id),
  FOREIGN KEY (classroom_id)
      REFERENCES classrooms (classroom_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS classroom_students (

  classroom_id uuid NOT NULL,
  student_id uuid NOT NULL,
  PRIMARY KEY (classroom_id, student_id),
  FOREIGN KEY (student_id)
      REFERENCES students (student_id),
  FOREIGN KEY (classroom_id)
      REFERENCES classrooms (classroom_id)
);
--------------------------------------------------
--------------------------------------------------
CREATE TABLE IF NOT EXISTS shared_documents (

  document_id uuid NOT NULL,
  user_id uuid NOT NULL,
  edit_level varchar (10),
  shared_date TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (document_id, user_id),
  FOREIGN KEY (user_id)
      REFERENCES users (user_id),
  FOREIGN KEY (document_id)
      REFERENCES documents (document_id)
);
--------------------------------------------------
--------------------------------------------------
COMMIT;
--------------------------------------------------
--------------------------------------------------