const awsses = require("aws-sdk/clients/ses");
const nodemailer = require("nodemailer");

fs = require('fs')
const ses= new awsses({ region: "us-east-1" });

module.exports.sendemailwithattachment =async  (files,email,message) => {
    const fileContent = Buffer.from(files.file.data, 'binary');
//console.log(fileContent)
//console.log(files)
console.log(ses)
    var mailOptions = {
        from: 'dangolevan@gmail.com',
        subject: 'this is contact us test',
        html: `<p>You got a contact message from: <b>${email}</b>
        message: <p>${message}</p>
        </p>`,
        to: 'dangolevan@gmail.com',
        // bcc: Any BCC address you want here in an array,
        attachments: [
            {
                filename: files.file.name,
                content: fileContent,
                ContentType: files.file.mimetype               
            }
        ]
    };

    console.log('Creating SES transporter');
    // create Nodemailer SES transporter
    var transporter = nodemailer.createTransport({
        SES: ses
    });

    // send email
 const resp = await new Promise((rsv, rjt) => {
transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return rjt(error)
        } 
        console.log(info)
        rsv('Email sent'); 
    });
});

return await response(resp);



};


async function response(data) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true // Required for CORS support to work
    },
    body: JSON.stringify(
      {
       data: data,
      },
      null,
      2
    ),
  };
}