const messages = []; // the storage unit for messages

const httpHandler = require('./httpHandler.js');
// httpHandler.initialize(messages); // not used, tried to use with httpHandler.js line 15

module.exports.enqueue = (message) => {
  console.log(`Enqueing message: ${message}`);
  messages.push(message);
};

module.exports.dequeue = () => {
  // returns undefined if messages array is empty
  return messages.shift();
};

