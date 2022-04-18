import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(database=os.getenv("DB_NAME"),
						user=os.getenv("DB_USERNAME"), password=os.getenv("DB_PASSWORD"),
						host=os.getenv("DB_HOST"), port=os.getenv("DB_PORT")
)

conn.autocommit = True
cursor = conn.cursor()

students_sql = '''COPY student(id,username,\
	first_name,last_name,\
	date_of_birth,address,\
	city,zipcode,\
	telephone,phone,\
	mobile,email,\
	year_group,is_active,\
	notes,creation_date)
FROM './app/migration/test/students.csv'
DELIMITER ','
CSV HEADER;'''

cursor.execute(students_sql)

students_query = '''select * from student;'''
cursor.execute(students_query)
for i in cursor.fetchall():
	print(i)

conn.commit()
conn.close()
