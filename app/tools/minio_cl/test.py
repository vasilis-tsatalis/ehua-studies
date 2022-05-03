import os
from pyminio import Pyminio

def create_new_bucket():

    pyminio_client = Pyminio.from_credentials(
        endpoint='127.0.0.1:9000',
        access_key='minioadmin',
        secret_key='minioadmin'
    )

    pyminio_client.mkdirs('/testbucket/')

    # pyminio_client.put_file(
    #     to_path='/test/',
    #     file_path=os.path.join(os.getcwd(), 'test.txt')
    # )