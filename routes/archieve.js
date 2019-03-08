const express = require('express');
const router = express.Router();
const models = require('../Models');

const config = require('../config')

function сountSkipingPages(page) {
  let result = 0;
  for (let i = 1; i < page; i++) {
    result += i;
  }
  return result;
}

function showPosts(req, res) {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const page = Number(req.params.page) || 1;
  const perPage = Number(config.PER_PAGE); 
  
  models.Post.find({})
    .skip(page * perPage - perPage)
    .limit(perPage)
    .populate('owner') //for getting user by value of owner, which equals user's id
    .sort({
      createdAt: -1 // for right rendering - before new posts,
    })
    .then( posts => {
      models.Post.countDocuments()
      .then(count => {        
        res.render('index', {
          posts,
          current: page,
          pages: Math.ceil(count / perPage),
          user: {
            id: userId,
            login: userLogin
          },
        })
      }).catch(() => {
        throw new Error('server error');
      })
    }).catch(() => {
      throw new Error('server error');
    })
}

router.get('/', (req, res) => {
  showPosts(req, res)
}); 

router.get('/archieve/:page', (req, res) => {
  showPosts(req, res)
});

router.get('/posts/:post', (req, res, next) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const url = req.params.post.trim().replace(/ +(?= )/g, '');

  if (!url || !userLogin || !userId) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    models.Post.findOne({
      url
    }).then((post) => {
      if (!post) {
        throw Error('Server error');
      } else {
        res.render('post/post', {
          post,
          user: {
            id: userId,
            login: userLogin
          },
        })
      }
    })
  }
});

router.get('/users/:login/:page*?', (req, res, next) => {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const login = req.params.login;
  const page = Number(req.params.page) || 1; 

  const perPage = Number(config.PER_PAGE); 
  
  models.User.findOne({
    login,
  }).then(user => {
    models.Post.find({
      owner: user.id
    })
    .skip(сountSkipingPages(page))
    .limit(page)
    .sort({
      createdAt: -1 // for right rendering - before new posts,
    })
    .then( posts => {
      models.Post.countDocuments({
        owner: user.id
      })
      .then(count => {
        console.log(count);
        res.render('user/user', {
          posts,
          _user: user,
          current: page,
          pages: Math.ceil(count / perPage),
          user: {
            id: userId,
            login: userLogin
          },
        })
      }).catch(() => {
        throw new Error('server error');
      })
    }).catch(() => {
      throw new Error('server error');
    })
  })
});
 
module.exports = router; 