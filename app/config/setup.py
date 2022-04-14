import os
from dotenv import load_dotenv
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
# DATABASE_URL = os.getenv("DATABASE_URL")

DATABASE_URL = "postgresql://{}:{}@{}:{}/{}".format(
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME  
)


SECRET = "48e568e98fa2cc8a23f323b729c13huv7l2a14a2be0712144af1493056165292"