
const minioClient = require('./minioClient');


const create_bucket = async (bucket_name) => {

    await minioClient.bucketExists(bucket_name, function(err, exists) {

        if (err) return console.log(err);

        if (!exists) {

            minioClient.makeBucket(bucket_name, 'us-east-1', function(err) {

                if (err) return console.log('Error creating bucket.', err);

            })
        };
    });
};

module.exports = create_bucket;
