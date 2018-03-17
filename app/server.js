var express = require('express');
var app = express();

var options = {
    root: __dirname, 
    dotfiles: 'deny'
};
var options_static = {
  root: __dirname + "/static/",
  dotfiles: 'ignore',
  index: false,
  redirect: false,
}

app.use(express.static('static', options_static));

app.get('/', function (req, res) {
    res.sendFile('index.html', options);
});

app.listen(5000);
console.log('Server is listening on port 5000');
