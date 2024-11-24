const AWS = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.S3 = new AWS.S3({
  region: 'ap-northeast-1',
  forcePathStyle: true, // If you want to use virtual host addressing of buckets, you can remove `forcePathStyle: true`.
  endpoint: 'http://s3.localhost.localstack.cloud:4566',
  sslEnabled: false,
  credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
  },
});

exports.generatePresignedUrl = async function (bucketName, objectKey) {
  const params = {
    Bucket: bucketName, 
    Key: objectKey,
  };

  try {
    // Generate presigned URL
    const presignedUrl = await getSignedUrl(exports.S3, new AWS.PutObjectCommand(params))
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
}