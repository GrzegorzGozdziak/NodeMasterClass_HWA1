/*
 * Primary file for REST API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./lib/config.js');
const handlers = require('./lib/handlers');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');

// Configure the HTTP server
const httpServer = http.createServer((req,res)=>{
  uniServer(req,res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log('\x1b[33m%s\x1b[0m',`The HTTP server is running on port: ${config.httpPort} in ${config.envName} mode`);
});

// Set the HTTPS server options
const httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
}

// Configure the HTTPS server
const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
  uniServer(req,res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log('\x1b[33m%s\x1b[0m',`The HTTPS server is running on port: ${config.httpsPort} in ${config.envName} mode`);
});

const uniServer = (req,res) => {

  // Get the method
  const method = req.method.toLowerCase();

  // Parse the url
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the headers as an object
  const headers = req.headers;

  // Get the payloads, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data',  (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Construct the data object to send to the handler
      let data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      // Route the request to the handler specified in the router
      chosenHandler(data, (statusCode,payload) => {

        // Use the status code returned from the handler, or set the default status code to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload) == 'object'? payload : {};

        // Convert the payload to a string
        let payloadString = JSON.stringify(payload);

        // Convert the data.payload to a string
        let dataString = JSON.stringify(data.payload);

        // Return the response
        res.setHeader('Content-Type','application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        // Set the font color for error log
        let consoleFontColor = statusCode == 200 ? '' : '\x1b[31m%s\x1b[0m';

        // Set the console message
        let consoleMessage = `
          Request:
          path: /${data.trimmedPath}
          method: ${data.method.toUpperCase()}
          status: ${statusCode}
          data: ${dataString}

          Response:
          ${payloadString}
        `;

        console.log(consoleFontColor,consoleMessage);
      });
  });
}

// Define the request router
const router = {
  'hello' : handlers.hello
};
