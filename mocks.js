const faker = require('faker');
const models = require('./Models');
const TurndownService = require('turndown')();

const owner = '5c7b99f2123c3e42e09c513d';

module.exports = () => {
  console.log('mocks');
  for(let i = 0; i < 20; i++) {
    models.Post.create({
      title: faker.lorem.words(5),
      body: TurndownService.turndown(faker.lorem.words(100)),
      owner
    }).then(console.log)
      .catch(console.log)
  }
} 