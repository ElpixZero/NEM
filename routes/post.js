const express = require('express');
const router = express.Router();
const models = require('../Models');
const tr = require('transliter'); // for work with russian letters

router.get('/add', async (req, res) => {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  if (!userLogin || !userId) {
    res.redirect('/');
  } else {
     try {
      const post = await models.Post.findOne({
        owner: userId,
        status: 'draft'
      })

      if (post) {

        res.redirect(`/post/edit/${post.id}`)
      } else {
        
        const post = await models.Post.create({
          owner: userId,
          status: 'draft'
        });

        console.log(post);

        res.redirect(`/post/edit/${post.id}`)
      }
     }
     catch(e) {
      console.log(e);
     }
  }
});

router.post('/add', async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userLogin || !userId) {
    res.redirect('/');
  } else {
    const title = req.body.title.trim().replace(/ +(?= )/g, '');
    const body = req.body.body.trim();
    const isDraft = !!req.body.isDraft;
    const postId = req.body.postId;
    const url = `${tr.slugify(title)}-${Date.now().toString(36)}`;

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
      try {    
          const post = await models.Post.findOneAndUpdate(
            {
              _id: postId,
              owner: userId
            }, 
            {
              title,
              body,
              owner: userId,
              status: isDraft ? "draft" : "published",
              url
            },
            { new: true }
          );
        
          if (!post) {
            res.json({
              ok: false,
              error: 'Это не ваш пост!'
            })
          } else {
            res.json({
              ok: true,
              post
            })
          }
      }
      catch(e) {
        res.json({
          ok: false,
          error: 'Повторите немного позже!'
        });      
      }
    }
  }
});

router.get('/edit/:id', async (req, res, next) => {
  const userLogin = req.session.userLogin;
  const userId = req.session.userId;
  const id = req.params.id.trim().replace(/ +(?= )/g, '');

  if (!userLogin || !userId) {
    res.redirect('/');
  } else {
    try {
      const post = await models.Post.findById(id).populate('uploads');

      if (!post) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      }

      res.render('post/edit', {
        post,
        user: {
          id: userId,
          login: userLogin
        }
      });
    }
    catch(e) {
      console.log(e);
    }
  }
})

module.exports = router; 