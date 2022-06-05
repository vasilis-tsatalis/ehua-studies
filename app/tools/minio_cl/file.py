from minio import Minio
from minio.error import ResponseError



client = Minio(endpoint='127.0.0.1:9000',
                secure= False,
                access_key='',
                secret_key='')


async def upload_file(bucket_name: str, filename: str, local_fullname: str):
    """
    upload file in existing bucket
    """
    try:
        client.fput_object(
            bucket_name, 
            filename, 
            local_fullname,
    )
    except ResponseError as err:
        print(err)


async def download_file(bucket_name: str, filename: str, local_fullname: str):
    """
    download file from existing bucket
    """
    try:
        client.fget_object(
            bucket_name, 
            filename, 
            local_fullname,
    )
    except ResponseError as err:
        print(err)


async def get_file(bucket_name: str, filename: str, local_fullname: str):
    """
    receive file from existing bucket
    """
    try:
        data = client.get_object(bucket_name, filename)
        with open(local_fullname, 'wb') as file_data:
            for d in data.stream(32*1024):
                file_data.write(d)
    except ResponseError as err:
        print(err)


async def remove_file(bucket_name: str, filename: str):
    """
    remove file from existing bucket
    """
    try:
        client.remove_object(bucket_name, filename)
    except ResponseError as err:
        print(err)