/*
 * Social Media Manager
 * Aims to bring together Article-Hunter, Twitter-Dashboard and more.
 * Author: James Wallis
 */

'use static'
var express = require('express');
var app     = express();
var server  = app.listen(8070);
var io      = require('socket.io').listen(server);
var bodyParser = require('body-parser');

// Load Product Modules
var articleHunter = require('./modules/article-hunter.js');
var twitter = require('./modules/twitter.js');


// Constant page directory
var webpages = __dirname + '/webpages/html';
var stylesheet = __dirname + '/webpages/css';
var script = __dirname + '/webpages/js';

// Static files
app.use('/', express.static(webpages, { extensions: ['html'] }));
app.use('/', express.static(stylesheet, { extensions: ['css'] }));
app.use('/', express.static(script, { extensions: ['js'] }));


/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());



// logging in order to fully understand what the API is doing
app.use('/', function(req, res, next) { console.log(new Date(), req.method, req.url); next(); });
// Message to show port
console.log("\nSocial Media Manager has been loaded!");
console.log("Available on port 8070\n");
articleHunter.showSettings();
twitter.showSettings();


//Connection Notifications
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

//Start Article Hunter when server starts
articleHunter.start(io);
twitter.start(io);
