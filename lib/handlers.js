/*
 * Primary handlers file
 *
 */

  // Dependencies
  const config = require('./config.js');

  // Define all the handlers
  let handlers = {};

  // hello handler
  handlers.hello = (data,callback)=>{
      callback(200,{'message':config.helloMessage});
  };

  // Not found handler
  handlers.notFound = (data,callback)=>{
    callback(404);
  };

  module.exports = handlers;
