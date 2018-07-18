require('dotenv/config')
const s3 = require('s3')
const mongodb = require('mongodb')
const { MongoClient } = mongodb

MongoClient.connect('mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPW + '@ds141641.mlab.com:41641/s3-ids', (err, db) => {
  if (err) {
    return console.log(err)
  }
  console.log('You are connected to the database!')
  db.close()
})

const client = s3.createClient({
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

const params = {
  localFile: "./test.png",

  s3Params: {
    Bucket: "s3practice12",
    Key: "randomscreenshot1",
  },
}
const uploader = client.uploadFile(params)
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
