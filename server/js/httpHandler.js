const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// const keypressHandler = require('./keypressHandler.js')
const fromMessageQueue = require('./messageQueue.js');

// Path for the background image ///////////////////////
// module.exports.backgroundImageFile = path.join('.', 'background.jpg');

module.exports.backgroundImageFile = path.join(__dirname, 'background.jpg');
////////////////////////////////////////////////////////

// not sure what this is for ?? ie, why does this exist here, if the messageQueue module already has prebuilt functions for enqueueing and dequeueing ...
let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  const { method, url } = req;

  console.log('Serving request type ' + method + ' for url ' + url);

  let parcel;
  const directions = ['up', 'down', 'left', 'right'];

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else if (req.method === 'GET' && url === '/') {
    res.writeHead(200, headers);
    parcel = fromMessageQueue.dequeue();
    parcel = parcel ? parcel : directions[Math.floor(Math.random() * 4)];
    res.end(parcel);
  } else if (req.method === 'GET' && url === '/background.jpg') {
    let filePath = module.exports.backgroundImageFile;

    // try {
    //     res.writeHead(200,
    //       Object.assign({
    //         'Content-Type': 'image/jpg'
    //       }, headers));
    //     stream.pipe(res);
    // } catch (e) {
    //   res.writeHead(404, headers);
    //   res.end();
    // }

    try {
      if (fs.existsSync(filePath)) {
        //file exists
        const stream = fs.createReadStream(filePath); // why does this not work with the syntax from line 10??

        res.writeHead(200,
          Object.assign({
            'Content-Type': 'image/jpg'
          }, headers));
        stream.pipe(res);
      } else {
        res.writeHead(404, headers);
        res.end();
      }
    } catch(err) {
      console.error(err)
    }

    // the NODE.js docs seemed to not recommend using fs.access in this way ... alternative?? was getting an error when tried to do this with a try...catch block
    // https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_access_path_mode_callback
    //   const stream = fs.createReadStream(filePath); // why does this not work with the syntax from line 10??

    // POSTMAN working but unit test not working with fs.access... not sure why ...
    // fs.access(filePath, (err) => {
    //   res.writeHead(101, headers);
    //   if (err) {
    //     res.writeHead(404, headers);
    //     res.end();
    //   } else {
    //     res.writeHead(200,
    //       Object.assign({
    //         'Content-Type': 'image/jpg'
    //       }, headers));
    //     stream.pipe(res);
    //   }
    // });
  } else if (method === 'POST' && url === '/background.jpg') {

    res.writeHead(200,
      Object.assign({
        'Content-type': 'image/jpg'
      }, headers));

    // const imageData = fs.createWriteStream();
    // req.pipe(imageData);

    // console.log('imageData: ', imageData);

    req.on('error', (err) => {
      console.log(err);
      // should also send some kind of server response noting the error
    });

    let imageData = [];
    req.on('data', (chunk) => {
      imageData.push(chunk);
    });
    req.on('end', () => {
      imageData = Buffer.concat(imageData);

      fs.writeFile(path.join(__dirname, 'test.jpg'), imageData, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('image saved successfully!');
        }
      })
      // let stream = fs.createWriteStream(path.join(__dirname, 'test.jpg'));
      console.log('imageData: ', imageData);
      res.end();
    })


  }

  next(); // invoke next() at the end of a request to help with testing!
};