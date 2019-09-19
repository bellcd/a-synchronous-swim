const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('req: ', req);

  const { method, url } = req;

  console.log('Serving request type ' + method + ' for url ' + url);

  let parcel;
  const directions = ['up', 'down', 'left', 'right'];
  if (req.method === 'GET') {
    parcel = directions[Math.floor(Math.random() * 4)];
  }

  res.writeHead(200, headers);
  res.end(parcel);
  next(); // invoke next() at the end of a request to help with testing!
};
