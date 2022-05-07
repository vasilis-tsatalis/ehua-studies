const Minio = require('minio');

require('dotenv/config');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_SERVER_HOST,
    port: parseInt(process.env.MINIO_SERVER_PORT),
    useSSL: process.env.MINIO_SSL_PREFER,
    accessKey: `${process.env.MINIO_ACCESS_KEY}`,
    secretKey: `${process.env.MINIO_SECRET_KEY}`
});

module.exports = minioClient;
