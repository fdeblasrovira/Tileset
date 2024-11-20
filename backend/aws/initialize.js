const AWS = require('@aws-sdk/client-s3');

const userImageBucketName = `tileset-${process.env.NODE_ENV}-user-images`

const s3 = new AWS.S3({
    region: 'ap-northeast-1',
    forcePathStyle: true, // If you want to use virtual host addressing of buckets, you can remove `forcePathStyle: true`.
    endpoint: 'http://s3.localhost.localstack.cloud:4566',
    sslEnabled: false,
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
});

exports.initializeLocalStack = async function () {
    // Call an S3 API using the LocalStack endpoint
    await s3.createBucket({ Bucket: userImageBucketName }, function (err, data) {
        if (err) {
            // console.log("Error", err);
        } else {
            console.log("Success", data.Location);
        }
    });
    const bucketList = (await s3.listBuckets()).Buckets
    console.log(bucketList)
    
    await s3.listBuckets(function (err, data) {
        console.log(1)
        if (err) {
            console.log(2)
            console.log("Error", err);
        } else {
            console.log(3)
            console.log("Success", data.Buckets);
        }
    });
}