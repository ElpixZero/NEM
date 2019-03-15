const express = require('express');
const router = express.Router();
const models = require('../Models');
const config = require('../config');
const moment = require('moment');
moment.locale('ru');


async function showPosts(req, res) {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const page = Number(req.params.page) || 1;
  const perPage = Number(config.PER_PAGE); 
  
  try {
    const posts = await models.Post.find({})
      .skip(page * perPage - perPage)
      .limit(perPage)
      .populate('owner') //for getting user by value of owner, which equals user's id
      .sort({
        createdAt: -1 // for right rendering - before new posts,
      });

    const countPosts = await models.Post.countDocuments();

    res.render('index', {
      posts,
      current: page,
      pages: Math.ceil(countPosts / perPage),
      user: {
        id: userId,
        login: userLogin
      },
    })

  }
  catch(e) {
    throw new Error('Posts is not founded');  }
}

router.get('/', (req, res) => {
  showPosts(req, res)
}); 

router.get('/archieve/:page', (req, res) => {
  showPosts(req, res)
});

router.get('/posts/:post', async (req, res, next) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;
  const url = req.params.post.trim().replace(/ +(?= )/g, '');

  if (!url || !userLogin || !userId) {
    const err = new Error('Not Found');
    err.status = 404;
    err.message = 'You are not authorized';
    next(err);
  } else {
    try {
      const post = await models.Post.findOne({
        url
      });

      if (!post) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      } else {

        const comments = await models.Comment.find({
          post: post.id,
          parent: {$exists: false} // for only rendering comments which dont have parents
        }).populate('children');

        res.render('post/post', {
          post,
          comments,
          moment,
          user: {
            id: userId,
            login: userLogin
          },
        })
      }
    }
    catch(e) {
      throw Error('Server error');
    }
  }
});

router.get('/users/:login/:page*?', async (req, res) => {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const login = req.params.login;
  const page = Number(req.params.page) || 1; 

  const perPage = Number(config.PER_PAGE); 
  
  try {
    const user = await models.User.findOne({
      login,
    });

    const posts = await models.Post.find({
      owner: user.id
    })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const countPosts = await models.Post.countDocuments({
      owner: user.id
    });

    res.render('user/user', {
      posts,
      _user: user,
      current: page,
      pages: Math.ceil(countPosts / perPage),
      user: {
        id: userId,
        login: userLogin
      },
    })
  }

  catch(e) {
    throw new Error('server error');
  }
});
 
module.exports = router; 