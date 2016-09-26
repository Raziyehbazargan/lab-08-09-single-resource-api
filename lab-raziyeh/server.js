'use strict';

// node modules - we reuiring http module and store in a const variable
const http = require('http');
// npm modules
// app modules
const Router = require('./lib/router.js');

// module constants - process.env.PORT can be configue in serverl shell
const PORT = process.env.PORT || 3000;
const router = new Router(); // we create an instance of router and store in a const variable
// module logic

require('./route/person-route.js')(router);
//OR
//const beerRoute = require('./route/person-route.js');
// beerRoute(router);

//we invoking createServer function and path router.route to it
const server = http.createServer(router.route());

server.listen(PORT, function(){
  console.log('server up on Port: ', PORT);
});
