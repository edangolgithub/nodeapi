var fs = require('fs');
function readstream(filename="a.txt") {   
  
    // This line opens the file as a readable stream
    var readStream = fs.createReadStream(filename);
   
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('data', function (data) {
      console.log(data.toString())
    });
  
    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
      console.log(err)
    });
  }
  //readstream()