const express = require('express');
const router = express.Router();
const models = require('../Models');
const TurndownService = require('turndown')(); // Convert HTML into Markdown

router.get('/add', (req, res) => {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;

  if (!userLogin || !userId) {
    res.redirect('/');
  } else  res.render('post/add', {
    user: {
      id: userId,
      login: userLogin
    }
  });
})

router.post('/add', (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userLogin || !userId) {
    res.redirect('/');
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, '');
    const body = req.body.body;

    if (!title || !body) {
      const fieldsError = [];

      if (!title) fieldsError.push('title');
      if (!body) fieldsError.push('body');

      res.json({
        ok: false,
        error: 'Заполните все поля',
        fields: fieldsError
      });
    } else if (title.length < 3 || title.length > 64) {
      res.json({
        ok: false,
        error: 'Заголовок поста должен содержать от 3-х до 64-х символов',
        fields: ['title']
      });
    } else if (body.length < 3) {
      res.json({
        ok: false,
        error: 'Текст поста должен содержать не менее 3-х символов',
        fields: ['body']
      });
    } else {
      models.Post.create({
        title,
        body: TurndownService.turndown(body),
        owner: userId,
      }).then(post => {
        console.log('post was added');
        console.log(post);

        res.json({
          ok: true,
        });
      })
      .catch(e => {
        res.json({
          ok: false,
          error: 'Произошла ошибка. Попробуйте немного позже'
        });
      });
    }
  }
});

module.exports = router; 