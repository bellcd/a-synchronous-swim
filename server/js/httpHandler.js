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
  // console.log('req: ', req);

  const { method, url } = req;

  console.log('Serving request type ' + method + ' for url ' + url);

  let parcel;
  const directions = ['up', 'down', 'left', 'right'];
  if (req.method === 'GET') {
    // parcel = fromMessageQueue.dequeue();
    // parcel = parcel ? parcel : directions[Math.floor(Math.random() * 4)];

    parcel = fromMessageQueue.dequeue();
    parcel = parcel ? parcel : directions[Math.floor(Math.random() * 4)];
  }

  res.writeHead(200, headers);
  res.end(parcel);
  next(); // invoke next() at the end of a request to help with testing!
};
