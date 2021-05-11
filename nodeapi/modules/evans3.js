var AwsS3 = require('aws-sdk/clients/s3');
const s3 = new AwsS3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-1',
});


const BUCKET_NAME = 'ed2021';

module.exports.createBucket = (bucketName) => {
    //const BUCKET_NAME = 'ed2021';

    const params = {
        Bucket: bucketName
    };

    return es3.createBucket(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data);
    });
}
module.exportslistbuckets=async()=> {
    // Call S3 to list the buckets
    return s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error", err);
            return err;
        } else {
            //  console.log("Success", data.Buckets);
            return data.Buckets;
        }
    }).promise();
}
module.exports.listobjects = (bucketname) => {
    var param = {
        Bucket: bucketname
    }

    // Call S3 to obtain a list of the objects in the bucket
    return s3.listObjects(param, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    }).promise();
}
module.exports.listobjectsv2 = (bucketname) => {
    var param = {
        Bucket: bucketname
    }

    // Call S3 to obtain a list of the objects in the bucket
    return s3.listObjectsV2(param, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    }).promise();
}


module.exports.fileupload = async (files,bucket="ed2021") => {
    // Binary data base64
    
    const fileContent = Buffer.from(files.file.data, 'binary');

    // Setting up S3 upload parameters
    const params = {
        Bucket: bucket,
        Key: "files/" + files.file.name, // File name you want to save as in S3
        Body: fileContent,
        ContentType:"mime/png"
    };

    // Uploading files to the bucket
    return s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(data)
        return data;
    }).promise();
}


module.exports.uploadimage = async (files, folder, bucket = 'ed2021') => {
    // Binary data base64
    console.log(files.image);
    const fileContent = Buffer.from(files.image.data, 'base64');
//console.log(fileContent)
    // Setting up S3 upload parameters
    const params = {
        Bucket: bucket,
        Key: "photos/" + folder + "/" + files.image.name, // File name you want to save as in S3
        Body: fileContent,
        ContentType: files.image.mimetype,
        ContentEncoding: 'base64'
        
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            console.log(err)
            throw err;
        }

    });
}