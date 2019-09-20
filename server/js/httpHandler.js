const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// const keypressHandler = require('./keypressHandler.js')
const fromMessageQueue = require('./messageQueue.js');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
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
    // parcel = fromMessageQueue.dequeue();
    // parcel = parcel ? parcel : directions[Math.floor(Math.random() * 4)];

    res.writeHead(200, headers);
    parcel = fromMessageQueue.dequeue();
    parcel = parcel ? parcel : directions[Math.floor(Math.random() * 4)];
    res.end(parcel);
  } else if (req.method === 'GET' && url === '/background.jpg') {
    let filePath = path.join(__dirname, 'background.jpg');

    // the NODE.js docs seemed to not recommend using fs.access in this way ... alternative?? https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_access_path_mode_callback
    fs.access(filePath, (err) => {
      if (err) {
        res.writeHead(404, headers);
        console.log(err);
        res.end(parcel);
      } else {
        const stream = fs.createReadStream(filePath); // why does this not work with the syntax from line 10??

        res.writeHead(200,
          Object.assign({
            'Content-Type': 'image/jpg'
          }, headers));
        stream.pipe(res);
      }
    });
  }
  next(); // invoke next() at the end of a request to help with testing!
};
