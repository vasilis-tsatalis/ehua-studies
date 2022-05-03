from minio import Minio
from minio.error import InvalidResponseError



client = Minio(endpoint='127.0.0.1:9000',
                secure= False,
                access_key='minioadmin',
                secret_key='minioadmin')


def bucket_exists(name: str):
    """
    check bucket name exists
    """
    try:
        found = client.bucket_exists(name)
        if not found:
            status = 'KO'
        else:
            status = 'OK'
    except InvalidResponseError as err:
        print(err)
        #status = err
    print(found)
    return status


async def create_bucket(name: str):
    """
    create new bucket
    """
    try:
        client.make_bucket(name)
    except InvalidResponseError as err:
        print(err)


async def list_of_buckets():
    """
    receive a list with existing buckets
    """
    buckets = client.list_buckets()
    for bucket in buckets:
        print(bucket.name, bucket.creation_date)

    return buckets

async def remove_bucket(name: str):
    """
    remove existing bucket only if it is empty
    """
    try:
        client.remove_bucket(name)
    except InvalidResponseError as err:
        print(err)
