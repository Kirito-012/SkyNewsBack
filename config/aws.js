const AWS = require('aws-sdk')

// Configure AWS SDK
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
})

// Create S3 instance
const s3 = new AWS.S3({
	params: {Bucket: process.env.AWS_S3_BUCKET_NAME},
	signatureVersion: 'v4',
})

module.exports = {s3, bucketName: process.env.AWS_S3_BUCKET_NAME}
