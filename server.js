const express = require('express');
const path = require('path');
const http = require('http');

var cors = require('cors');
const bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
session = require('express-session');
multer = require('multer');
upload = multer({ dest: 'uploads/' });

// Get our API routes
const api = require('./server/routes/api');

const app = express();
app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))




app.use(cors({origin: '*'}));


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// use it before all route definitions


// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));
// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file


app.get('*', (req, res) => {res.sendFile(path.join(__dirname, 'dist/index.html'));});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '80';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
