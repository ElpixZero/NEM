const express = require('express');
const router = express.Router();
const models = require('../Models');
const bcrypt = require('bcrypt-nodejs'); // for safing password. It changes it by adding hash/

router.post('/register', async (req, res) => {
  const {login, password, passwordConfirm} = req.body;

  if (!login || !password || !passwordConfirm) {
    const fieldsError = [];

    if (!login) fieldsError.push('login');
    if (!password) fieldsError.push('password');
    if (!passwordConfirm) fieldsError.push('passwordConfirm');

    res.json({
      ok: false,
      error: 'Заполните все поля',
      fields: fieldsError
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  } else if (login.length < 3 || login.length > 16) {
      res.json({
        ok: false,
        error: 'Логин должен содержать от 3 до 16 символов',
        fields: ['login']
      });
  } else if(password.length < 6) {
      res.json({
        ok: false,
        error: 'Пароль должен содержать не менее 6 символов',
        fields: ['login']
      });
  } else if (password !== passwordConfirm) {
      res.json({
        ok: false,
        error: 'Пароли не совпадают',
        fields: ['password', 'passwordConfirm']
      });
  } else {
      try {
        const user = await models.User.findOne({
          login
        });

        if (!user) {
          bcrypt.hash(password, null, null, async (err, hash) => {
            const user = await models.User.create({
              login,
              password: hash
            });
            
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            
            res.json({
              ok: true,
              message: 'Успешно!'
            }); 
          })
        } else {
          res.json({
            ok: false,
            error: "Логин занят! Выберите, пожалуйста, другой"
          })
        }
      }
      catch(e) {
        throw new Error('Ошибка сервера. Попробуйте, пожалуйста, немного позже')
      }
    }
});

router.post('/logging', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fieldsError = [];

    if (!login) fieldsError.push('login');
    if (!password) fieldsError.push('password');

    res.json({
      ok: false,
      error: 'Заполните все поля',
      fields: fieldsError
    });
  } else {
      try {
        const user = await models.User.findOne({
          login,
        });

        if (!user) {
          res.json({
            ok: false,
            error: "Неправильный логин или пароль"
          });
        } else { 
          bcrypt.compare(password, user.password, (err, result) => {
            if (!result) {
              res.json({
                ok: false,
                error: "Неправильный логин или пароль",
                fields: ['login', 'password']
              });
            } else {
              req.session.userId = user.id;
              req.session.userLogin = user.login;
    
              res.json({
                ok: true,
                message: 'Аккаунт найден!'
              });
            }
          });
        }
      }

      catch(e) {
        throw new Error('Ошибка сервера. Попробуйте, пожалуйста, немного позже')
      }
    }
});

router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
})

module.exports = router; 