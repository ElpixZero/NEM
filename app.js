/* eslint-disable node/no-extraneous-require*/
/* eslint-disable node/no-unpublished-require*/

const express = require('express');
const bodyParser = require('body-parser');
const staticAsset = require('static-asset'); // for reqired refreshing page
// const Post = require('./Models/post.js');
const path = require('path');
const config = require('./config');
const mongoose = require('mongoose');

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Db connectd closed'))
  .on('open', () => {
    const info = mongoose.connection;
    console.log(`Connected to ${info.host}:${info.port}:${info.name}`);
  });

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });


// express
const app = express();

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

// routers
app.get('/', function (req, res) {
  res.render('index');
}); 

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {},
    title: 'Ooops...'
  });
});


app.listen(config.PORT, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`server is connected on ${config.PORT} port`);
});
