'use strict';

const serverless = require('serverless-http');
const express = require('express')
const app = express()
var cors = require('cors')
const fileUpload = require('express-fileupload');
var AwsS3 = require('aws-sdk/clients/s3');
var fs = require('fs');

const evans3 = require('./modules/evans3.js')

const evan= require("./modules/evan.js")

const fil=require("./modules/file.js")

const dyno= require("./modules/dynamodb")

const es3 = new AwsS3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1',
});




app.use(fileUpload({
  createParentPath: true
}));
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.get('/',async function (req, res) {
//   res.send("hello");
// });

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/dyscan', async function (req, res) {
  var data = await dyno.scanitem();
  console.log(data)
  res.json({ "data": data });
});


app.get('/stream', (req, res) => {
  const src = fs.createReadStream('./modules/file.html');
  //const src = fs.createReadStream('https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/');
  src.pipe(res);
});
app.get('/stream1', (req, res) => {
 fil.readstream(req,res)
});

app.get('/list', async function (req, res) {
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

app.get("/user/:userName", async (req, res) => {
  res.send(`Welcome, ${req.params.userName}`);
})


app.get('/createbucket/:bucketname', (req, res) => {
  console.log(req)
  var data = es33.createBucket(req.params.bucketname)
  console.log(data)
  res.send("ok")

})

app.get('/promise',async (req, res) => {
 
  var data =await evan.func1();
  res.send(data)

})




app.post('/', (req, res) => res.send("post"))

app.post('/user', (req, res) => {
  console.log(req.body)
  res.json(req.body.name)

})

app.post('/fupload2', async (req, res) => {
  const { files } = req
  console.log(files)

  // Binary data base64
  const fileContent = Buffer.from(files.avatar.data, 'binary');

  // Setting up S3 upload parameters
  const params = {
    Bucket: 'ed2021',
    Key: files.avatar.name, // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  es3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    res.send({
      "response_code": 200,
      "response_message": "Success",
      "response_data": data
    });
  });



})
app.post('/imageupload', async (req, res) => {
  const { files } = req
  console.log(req)
  if (!req.files) {
    res.send({
      status: false,
      message: 'No file uploaded'
    });
    return;
  }
    // Binary data base64
    const fileContent = Buffer.from(files.image.data, 'binary');

    // Setting up S3 upload parameters
    const params = {
      Bucket: 'ed2021',
      Key: "photos/" + req.body.folder + "/" + files.image.name, // File name you want to save as in S3
      Body: fileContent
    };

    // Uploading files to the bucket
    es3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      res.send({
        "response_code": 200,
        "response_message": "Success",
        "response_data": data
      });
    });
  })


app.post('/fupload3', async (req, res) => {
  const { files } = req
  const data = mod.fupload3(files.avatar)
  console.log(data)
  res.send({
    "response_code": 200,
    "response_message": "Success",
    "response_data": data
  });
});


















// app.post('/fupload', upload.single('avatar'), (req, res) => {
//   try {

//     if (!req.files) {
//       res.send({
//         status: false,
//         message: 'No file uploaded'
//       });
//     } else {
//       //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
//       let avatar = req.files.avatar;

//       //Use the mv() method to place the file in upload directory (i.e. "uploads")
//       avatar.mv('./uploads/' + avatar.name);

//       //send response
//       res.send({
//         status: true,
//         message: 'File is uploaded',
//         data: {
//           name: avatar.name,
//           mimetype: avatar.mimetype,
//           size: avatar.size
//         }
//       });
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// })


// app.post('/fupload1', (req, res) => {
//   try {
//     console.log(req.file)
//     console.log(req.files)
//     console.log("uhiuhu")
//     if (!req.files) {
//       res.send({
//         status: false,
//         message: 'No file uploaded'
//       });
//     } else {
//       //console.log(req)
//       es33.uploadFileTos3("ed2021",req.files.avatar)

//       //send response
//       res.send("uplo");
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// })


module.exports.start = serverless(app);

