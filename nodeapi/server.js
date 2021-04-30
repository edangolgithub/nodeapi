'use strict';

const serverless = require('serverless-http');
const express = require('express')
const app = express()
var cors = require('cors')
const fileUpload = require('express-fileupload');
const evans3 = require('./modules/evans3.js')


app.use(fileUpload({
  createParentPath: true
}));
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/createbucket/:bucketname', (req, res) => {
  console.log(req)
  var data = es33.createBucket(req.params.bucketname)
  console.log(data)
  res.send("ok")

})

app.get('/listbuckets', async function (req, res) {
  var data = await evans3.listbuckets()
  console.log(data)
  res.json({ "data": data });
});

app.get('/listobjects/:bucketname', async function (req, res) {
  var data = await evans3.listobjects(req.params.bucketname)
  console.log(data)
  res.json({ "data": data });
});
app.get('/listobjectsv2/:bucketname', async function (req, res) {
  var data = await evans3.listobjectsv2(req.params.bucketname)
  console.log(data)
  res.json({ "data": data });
});







app.post('/imageupload', async (req, res) => {
  const { files } = req
  //console.log(req)
  if (!req.files) {
    res.send({
      status: false,
      message: 'No file uploaded'
    });
    return;
  }
  const data = await evans3.uploadimage(files, req.body.folder);
  res.send({
    "response_code": 200,
    "response_message": "Success",
    "response_data": data
  });
})
app.post('/fileupload', async (req, res) => {
  const { files } = req
  //console.log(req)
  if (!req.files) {
    res.send({
      status: false,
      message: 'No file uploaded'
    });
    return;
  }
  var bucketname="";
  if(!req.body.bucket)
  {
     bucketname="ed2021"
  }
  else
  {
    bucketname=req.body.bucket
  }
  const data = await evans3.fileupload(files, bucketname);
  res.send({
    "response_code": 200,
    "response_message": "Success",
    "response_data": data
  });
})


module.exports.start = serverless(app);

