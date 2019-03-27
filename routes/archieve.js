const express = require('express');
const router = express.Router();
const models = require('../Models');
const config = require('../config');
const moment = require('moment');
const showdown = require('showdown');

moment.locale('ru');
const converter = new showdown.Converter();


async function showPosts(req, res) {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const page = Number(req.params.page) || 1;
  const perPage = Number(config.PER_PAGE); 
  
  try {
    let posts = await models.Post.find({
      status: 'published'
    })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .populate('owner') //for getting user by value of owner, which equals user's id
      .populate('uploads')
      .sort({
        createdAt: -1 // for right rendering - before new posts,
      });


    posts = posts.map(post => {
      let body = post.body;
      if( post.uploads.length) {
        post.uploads.forEach(upload => {
          body = body.replace(`image${upload.id}`, `/${config.DESTINATION}${upload.path}`);
        })
      }
      return Object.assign(post, {
        body: converter.makeHtml(body)
      })
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

router.get('/post/:post', async (req, res, next) => {
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
        url,
        status: 'published'
      }).populate('uploads');

      if (!post) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      } else {
        let body = post.body;
        if (post.uploads.length) {
          post.uploads.forEach(upload => {
            body = body.replace(`image${upload.id}`, `/${config.DESTINATION}${upload.path}`);
          });
        }       

        const comments = await models.Comment.find({
          post: post.id,
          parent: {$exists: false} // for only rendering comments which dont have parents
        }).populate('children');

        res.render('post/post', {
          post: Object.assign(post, {
            body: converter.makeHtml(body)
          }),
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

    let posts = await models.Post.find({
      owner: user.id
    })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .populate('uploads')
      .sort({ createdAt: -1 });

      posts = posts.map(post => {
        let body = post.body;
        if( post.uploads.length) {
          post.uploads.forEach(upload => {
            body = body.replace(`image${upload.id}`, `/${config.DESTINATION}${upload.path}`);
          })
        }
        return Object.assign(post, {
          body: converter.makeHtml(body)
        })
      });

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