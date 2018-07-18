require('dotenv/config')
var s3 = require('s3')

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.AKID,
    secretAccessKey: process.env.SECRET,
    // any other options are passed to new AWS.S3()
  },
})

var params = {
  localFile: "./test.png",

  s3Params: {
    Bucket: "s3practice12",
    Key: "randomscreenshot1",
  },
}
var uploader = client.uploadFile(params)
uploader.on('error', function(err) {
  console.error("unable to upload:", err.stack)
});
uploader.on('progress', function() {
  console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal)
});
uploader.on('end', function() {
  console.log("upload complete")
})
