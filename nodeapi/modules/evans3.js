var AwsS3 = require('aws-sdk/clients/s3');
const s3 = new AwsS3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-1',
});


const BUCKET_NAME = 'ed2021';
export async function listbuckets() {
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
export const createBucket = (bucketName) => {
    //const BUCKET_NAME = 'ed2021';

    const params = {
        Bucket: bucketName
    };

    return es3.createBucket(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data);
    });
}

export const uploadFileTos3 = (bucketName, fileName) => {
    console.log(fileName.name)
    return
    // Read content from the file
    //const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: fileName.name, // File name you want to save as in S3
        Body: fileName
    };

    // Uploading files to the bucket
    es3.upload(params, function (err, data) {
        if (err) {
            console.log(err)
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

export const fupload3 = (file) => {
    // Binary data base64
    const fileContent = Buffer.from(file.data, 'binary');

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'ed2021',
        Key: "photos/" + file.name, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    return es3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(data)
        return data;
    }).promise();
}

export const listobjects = (bucketname) => {
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