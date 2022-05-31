#!/usr/bin/python

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(verbose=True)

def delete_table_data(table, the_id, value):
    """ delete table by id """
    conn = None
    rows_deleted = 0
    try:
        # connect to the PostgreSQL database
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            )
        # create a new cursor
        cur = conn.cursor()
        # execute the delete  statement
        cur.execute("DELETE FROM %s WHERE %s = %s", (table,the_id,value,))
        # get the number of deleted rows
        rows_deleted = cur.rowcount
        # Commit the changes to the database
        conn.commit()
        # Close communication with the PostgreSQL database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    return rows_deleted


if __name__ == '__main__':
    deleted_rows = delete_table_data("mytable","id","2")
    print('The number of deleted rows: ', deleted_rows)