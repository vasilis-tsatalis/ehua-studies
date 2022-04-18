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

role_types_c = '''COPY role_type(id,name,\
description,creation_user)
FROM './app/migration/data/departments.csv'
DELIMITER ','
CSV HEADER;'''

cursor.execute(role_types_c)

role_types_q = '''select * from role_type;'''
cursor.execute(role_types_q)
for i in cursor.fetchall():
	print(i)

conn.commit()
conn.close()
