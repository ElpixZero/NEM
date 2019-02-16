const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

let arr = ['hello', 'world', 'ichangeyou'];

app.get('/', function (req, res) {
  res.render('index', { arr: arr})
}); 

app.get('/create', function (req, res) {
  res.render('create')
}); 

app.post('/create', function (req, res) {
  arr.push(req.body.text);
  res.redirect('/');
}); 

module.exports = app;
