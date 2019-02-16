const config = require('./config');
const mongoose = require('mongoose');

module.exports = () => {
  return new Promise( (res, rej) => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);

    mongoose.connection
      .on('error', error => rej(error))
      .on('close', () => console.log('Db connectd closed'))
      .on('open', () => res(mongoose.connection));

    mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });
  });
}