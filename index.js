const http = require('http');
const app = require('./app');
require('dotenv').config({ debug: false });
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
