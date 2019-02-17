 const app = require('./app.js'); 
 const database = require('./database.js');
 const config = require('./config');

database()
  .then( info => {
    console.log(`Connected to ${info.host}:${info.port}:${info.name}`);
    app.listen(config.PORT, function (err) {
      if (err) {
        console.log(err);
      }
      console.log(`server is connected on ${config.PORT} port`);
    });
  })
  .catch( () => {
    console.log('Unable to connect to database');
    process.exit(1);
  });