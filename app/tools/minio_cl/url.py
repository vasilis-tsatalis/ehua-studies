from datetime import datetime, timedelta

from minio import Minio, PostPolicy
from minio.error import ResponseError


client = Minio('s3.amazonaws.com',
               access_key='YOUR-ACCESSKEYID',
               secret_key='YOUR-SECRETACCESSKEY')


async def post_presigned_url(bucket_name: str, filename: str):

    post_policy = PostPolicy()
    # set bucket name location for uploads.
    post_policy.set_bucket_name(bucket_name)
    # set key prefix for all incoming uploads.
    post_policy.set_key_startswith(filename)

    # set expiry 10 days into future.
    expires_date = datetime.utcnow() + timedelta(days=10)
    post_policy.set_expires(expires_date)

    try:
        url, signed_form_data = client.presigned_post_policy(post_policy)

        curl_cmd = (
            ['curl -X POST {0}'.format(url)] +
            ['-F {0}={1}'.format(k, v) for k, v in signed_form_data.items()] +
            ['-F file=@<FILE>']
        )

        # print curl command to upload files.
        print(' '.join(curl_cmd))
        return url
    except ResponseError as err:
        print(err)


async def get_presigned_url(bucket_name: str, filename: str):
    # presigned get object URL for object name, expires in 7 days.
    try:
        url = client.presigned_get_object(bucket_name, filename)
        return url
    except ResponseError as err:
        print(err)
