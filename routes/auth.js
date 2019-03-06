const express = require('express');
const router = express.Router();
const models = require('../Models');
const bcrypt = require('bcrypt-nodejs'); // for safing password. It changes it by adding hash/


//POST is authorized
router.post('/register', (req, res) => {
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
      models.User.findOne({
        login
      }).then( user => {
        if (!user) {
          bcrypt.hash(password, null, null, (err, hash) => {

            models.User.create({
              login,
              password: hash
            })
            .then (user => {
              req.session.userId = user.id;
              req.session.userLogin = user.login;
              
              res.json({
                ok: true,
                message: 'Успешно!'
              }); 
            })
            .catch(e => {
              console.log(e);
              res.json( {
                ok: false,
                message: 'Попробуйте позже!'
              });
            });
          }); 
        } else {
          res.json({
            ok: false,
            error: "Логин занят! Выберите, пожалуйста, другой"
          })
        }
      })
    }
});

//POST for logging
router.post('/logging', (req, res) => {
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
  } else models.User.findOne({
      login,
  }).then( user => {
    if (!user) {
      res.json({
        ok: false,
        error: "Неправильный логин или пароль"
      });
    } else {
      bcrypt.compare(password, user.password, function(err, result) {
        if (!result) {
          console.log(user);
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
  })
  .catch(e => {
    console.log(e);
    res.json( {
      ok: false,
      message: 'Попробуйте позже!'
    });
  });
});



//POST for logout
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