
const minioClient = require('./minioClient');


const receive_presigned_url = async (bucket_name, minio_file_name, expiration_sec) => {

    await minioClient.presignedUrl('GET', bucket_name, minio_file_name, expiration_sec, function(err, presignedUrl) {

        if(err) return console.log(err);

        console.log(presignedUrl);
    });
};


module.exports = receive_presigned_url;