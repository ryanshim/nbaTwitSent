// Server backend script
// This script includes the app routing for other pages
// we would like to serve.

// Dependencies
var express = require("express");
var app = express();

// Index page route
app.get('/', function (req, res) {
    res.sendFile('index.html', { root : '../public/model/' });  // setting the root dir will have express
});                                                             // start looking for the file in that particular dir

app.listen(5000);
console.log('Server is listening')
