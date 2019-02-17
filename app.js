const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Post = require('./Models/post.js');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

let arr = ['hello', 'world', 'ichangeyou'];

app.get('/', function (req, res) {
  Post.find({}) // Post receives Promise and you can use .then/.catch and the same in createPost below
  .then(post => res.render('index', { post })
  )
}); 

app.get('/create', function (req, res) {
  res.render('create')
}); 

app.post('/create', function (req, res) {
  const {title, body} = req.body;

  Post.create({
    title,
    body
  })
  .then( post => console.log(post));
  res.redirect('/');
}); 

module.exports = app;
