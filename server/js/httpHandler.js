const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

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
  const { method, url  } = req;
  let parcel;
  const directions = ['up', 'down', 'left', 'right'];

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  } else if (req.method === 'GET') {
    if (url === '/') {
      res.writeHead(200, headers);
      parcel = messageQueue.dequeue();
      parcel = parcel ? parcel : directions[Math.floor(Math.random() * 4)];
      res.end(parcel);
      next();
    } else if (url === '/background.jpg') {
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);

        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
        }
        res.end();
        next();
      });
    }
  } else if (method === 'POST' && url === '/background.jpg') {
    var fileData = Buffer.alloc(0);

    req.on('data', (chunk) => {
      fileData = Buffer.concat([fileData, chunk]);
    });

    req.on('end', () => {
      var file = multipart.getFile(fileData);
      fs.writeFile(module.exports.backgroundImageFile, file.data, (err) => {
        res.writeHead(err ? 400 : 201,
          Object.assign({
            'Content-type': 'image/jpg'
          }, headers));
        res.end();
        next();
      });
    });
  }
};