/* eslint-disable node/no-extraneous-require*/
/* eslint-disable node/no-unpublished-require*/

const express = require('express');
const bodyParser = require('body-parser');
const staticAsset = require('static-asset'); // for reqired refreshing page, it adding hash
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const mongoose = require('mongoose');
const session = require('express-session'); //allow to create session in express
const MongoStore = require('connect-mongo')(session); //allow to connect this session to MongoDb

// database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Db connectd closed'))
  .on('open', () => {
    const info = mongoose.connection;
    console.log(`Connected to ${info.host}:${info.port}:${info.name}`);
    // require('./mocks')();
  });

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });


// express
const app = express();

// sessions
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);
app.use('/uploads', express.static(path.join(__dirname, config.DESTINATION)));

// routers
app.use('/api/auth', routes.auth);
app.use('/post', routes.post);
app.use('/', routes.archieve);
app.use('/comment', routes.comment);
app.use('/upload', routes.upload);


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
