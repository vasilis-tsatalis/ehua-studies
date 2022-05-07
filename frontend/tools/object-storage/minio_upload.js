
const minioClient = require('./minioClient');

const upload_document = async (bucket_name, file_fullname, minio_file_name) => {

    const stream = fs.createReadStream(file_fullname);
    const the_file = stream.on("data", function(data) {
    const chunk = data.toString();
    return chunk;
    });

    await minioClient.putObject(bucket_name, minio_file_name, the_file, function(error, objInfo) {

        if(error) return console.log(error);

        console.log("Success", objInfo);

    });
};


module.exports = upload_document;
