require('dotenv/config')
const uuid = require('uuid/v4')
const s3 = require('s3')
const mongodb = require('mongodb')
const { MongoClient } = mongodb

const s3client = s3.createClient({
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

const params1 = {
  localFile: "./random.png",

  s3Params: {
    Bucket: "s3practice12",
    Key: "randomscreenshot1",
  },
}

const downloader = s3client.downloadFile(params1);
downloader.on('error', function(err) {
  console.error("unable to download:", err.stack)
})
downloader.on('progress', function() {
  console.log("progress", downloader.progressAmount, downloader.progressTotal)
})
downloader.on('end', function() {
  console.log("done downloading")
})

MongoClient
  .connect('mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPW + '@ds141641.mlab.com:41641/s3-ids', {useNewUrlParser: true})
  .then(client => {
  const db = client.db('s3-ids')
  const collection = db.collection('keys')
  const uploader = s3client.uploadFile(params)
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack)
  })
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
              uploader.progressAmount, uploader.progressTotal)
  })
  uploader.on('end', function() {
    console.log("upload complete")
    return params.s3Params.Key
  })
  const realKey = {
    id: uuid(),
    key: params.s3Params.Key
  }
  return collection
  .insertOne(realKey)
  .then(() => client.close())
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
