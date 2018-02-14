// Dependencies
var express = require("express");
var app = express();

// Index page route
app.get('/', function (req, res) {
    res.sendFile('index.html', { root : '../public/model/' });
});


app.listen(5000);
console.log('Server is listening')
