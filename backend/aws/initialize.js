const { S3 } = require("./S3");
const { exec } = require('child_process');

exports.initializeLocalStack = async function () {
    const userImageBucketName = process.env.S3_IMAGE_BUCKET_NAME

    // Call an S3 API using the LocalStack endpoint
    await S3.createBucket({ Bucket: userImageBucketName }, function (err, data) {
        if (err) {
            // console.log("Error", err);
        } else {
            console.log("Success", data.Location);
        }
    });
    console.log("Configuring S3 bucket CORS")
    exec(`awslocal s3api put-bucket-cors --bucket ${userImageBucketName} --cors-configuration file://aws/cors.json`, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log(err)
            return;
        }

        console.log("CORS configuration successfully applied")
    });
}