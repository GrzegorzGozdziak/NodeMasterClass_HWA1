# Simple REST API

## Description

Simple REST API in Node.js

When someone posts anything to the route /hello, app will return a welcome message in JSON format.

## How to use it

### Get the repository

Clone repository:

```
git clone https://github.com/GrzegorzGozdziak/NodeMasterClass_HWA1.git
```

### Start it

Start up the HTTP(S) server in console (in project directory):

```
node index.js
```

### Test it:

```
// HTTP server in staging mode
curl http://localhost:3000/hello

// HTTPS server in staging mode
curl -k https://localhost:3001/hello

// HTTP server in production mode
curl http://localhost:5000/hello

// HTTPS server in production mode
curl -k https://localhost:5001/hello
```

### Switch between the staging and the production mode

in Linux:
```
// for staging mode:
NODE_ENV=staging node index.js

// for production mode:
NODE_ENV=production node index.js
```

in Windows:
```
// for staging mode:
SET NODE_ENV=staging
node index.js

// for staging mode:
SET NODE_ENV=production
node index.js
```

## Author

* Grzegorz Gozdziak

## Licence

This project is licensed under the MIT License
