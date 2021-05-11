"use strict";

const serverless = require("serverless-http");
const express = require("express");
const app = express();

const awsses = require("aws-sdk/clients/ses");

const ses1 = new awsses({ region: "us-east-1" });

var cors = require("cors");
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
const fileUpload = require("express-fileupload");
const evans3 = require("./modules/evans3.js");
const ses = require("./modules/ses");

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.get("/", (req, res) => res.send("Hello World!"));

app.get("/createbucket/:bucketname", (req, res) => {
  console.log(req);
  var data = es33.createBucket(req.params.bucketname);
  console.log(data);
  res.send("ok");
});

app.get("/listbuckets", async function (req, res) {
  var data = await evans3.listbuckets();
  console.log(data);
  res.json({ data: data });
});

app.get("/listobjects/:bucketname", async function (req, res) {
  var data = await evans3.listobjects(req.params.bucketname);
  console.log(data);
  res.json({ data: data });
});
app.get("/listobjectsv2/:bucketname", async function (req, res) {
  var data = await evans3.listobjectsv2(req.params.bucketname);
  console.log(data);
  res.json({ data: data });
});

app.post("/imageupload", async (req, res) => {
  const { files } = req;
  //console.log(req)
  if (!req.files) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
    return;
  }
  const data = await evans3.uploadimage(files, req.body.folder);
  res.send({
    response_code: 200,
    response_message: "Success",
    response_data: data,
  });
});
app.post("/fileupload", async (req, res) => {
  const { files } = req;
  //console.log(req)
  if (!req.files) {
    res.send({
      status: false,
      message: "No file uploaded",
    });
    return;
  }
  var bucketname = "";
  if (!req.body.bucket) {
    bucketname = "ed2021";
  } else {
    bucketname = req.body.bucket;
  }
  const data = await evans3.fileupload(files, bucketname);
  res.send({
    response_code: 200,
    response_message: "Success",
    response_data: data,
  });
});

app.post("/sendemailwithattachment", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed

  const { files,email,message } = req;

  console.log(req.body.email);
  const data = await ses.sendemailwithattachment(files, req.body.email, req.body.message);

  res.send({
    data,
  });
});
app.post("/sendemail", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  ); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed

  var img = req.body;
  var email = req.email;
  var message = req.message;
  const params = {
    Destination: {
      ToAddresses: ["dangolevan@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: `You just got a message from "customer" - ${req.email}:
          ${req.message}`,
        },
      },
      Subject: { Data: "data" },
    },
    Source: "admin@ecolawnlandscaping.tk",
    ReplyToAddresses: req.replyaddresses,
  };
  var data = await ses1.sendEmail(params).promise();
  res.send({ d: data });
});

module.exports.start = serverless(app);
