const express = require('express');
const router = express.Router();
const models = require('../Models');

const config = require('../config')

function showPosts(req, res) {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const page = Number(req.params.page) || 1; //нормально привести к типу Int
  const perPage = Number(config.PER_PAGE); 
  
  models.Post.find({})
    .skip(perPage * page - perPage)
    .limit(page)
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
 
module.exports = router; 