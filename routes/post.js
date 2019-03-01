const express = require('express');
const router = express.Router();
const models = require('../Models');

// routes
router.get('/add', (req, res) => {
  const login = req.session.userLogin;
  const id = req.session.userId;

  res.render('post/add', {
    user: {
      id,
      login
    }
  });
})

router.post('/add', (req, res) => {
  
  const {title, body} = req.body;

  if (!title || !body) {
    const fieldsError = [];

    if (!title) fieldsError.push('title');
    if (!body) fieldsError.push('body');

    res.json({
      ok: false,
      error: 'Заполните все поля',
      fields: fieldsError
    });
  } else if (body.length < 3) {
    res.json({
      ok: false,
      error: 'Текст поста должен содержать не менее 3-х символов',
      fields: ['body']
    });
  } else res.json({
    ok: true,
  });
});

module.exports = router; 