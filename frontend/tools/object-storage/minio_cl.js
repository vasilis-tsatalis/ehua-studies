const Minio = require('minio');

require('dotenv/config');

const minioClient = new Minio.Client({
    endPoint: String(process.env.MINIO_SERVER_HOST),
    port: parseInt(process.env.MINIO_SERVER_PORT),
    //useSSL: process.env.MINIO_SSL_PREFER,
    useSSL: false,
    accessKey: String(process.env.MINIO_ACCESS_KEY),
    secretKey: String(process.env.MINIO_SECRET_KEY)
});

module.exports = minioClient;
