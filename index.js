require('dotenv/config')
var s3 = require('s3')

var client = s3.createClient({
  maxAsyncS3: 20,
  s3RetryCount: 3,
  s3RetryDelay: 1000,
  multipartUploadThreshold: 20971520,
  multipartUploadSize: 15728640,
  s3Options: {
    accessKeyId: process.env.AKID,
    secretAccessKey: process.env.SECRET,
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
