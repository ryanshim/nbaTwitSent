var express = require('express');
var app = express();
var api = require('./api');

var options = {
    root: __dirname + '/views',
    index: false,
    extensions: ['html', 'htm'],
    fallthrough: true
};
var options_static = {
  index: false,
  redirect: false
}

app.get('/', function(req, res) {
    res.sendFile('index.html', options);
});

app.use('/api', api);

app.use('/css', express.static('static/css', options_static));
app.use('/js', express.static('static/js', options_static));
app.use('/images', express.static('static/images', options_static));
app.use('/fonts', express.static('static/fonts', options_static));
app.use(express.static('views', options));

// Error handling
app.use(function(err, req, res, next) {
    console.error(err.stack);
    next(err);
});
app.use(function(req, res, next) {
    console.error("404: " + req.method + " " + req.url);
    res.status(404).send("404");
});

app.listen(5000);
console.log('Server is listening on port 5000');
