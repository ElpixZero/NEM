/* eslint-disable node/no-extraneous-require*/
/* eslint-disable node/no-unpublished-require*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const staticAsset = require('static-asset'); // for reqired refreshing page
// const Post = require('./Models/post.js');
const path = require('path');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);


app.get('/', function (req, res) {
  res.render('index');
}); 

module.exports = app;
