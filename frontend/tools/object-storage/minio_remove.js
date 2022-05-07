
const minioClient = require('./minioClient');

const remove_document = async (bucket_name, minio_file_name) => {

    await minioClient.removeObject(bucket_name, minio_file_name, function(err) {

        if (err) {

          return console.log('Unable to remove object', err)

        }

        console.log('Removed the object');

      })
};


module.exports = remove_document;