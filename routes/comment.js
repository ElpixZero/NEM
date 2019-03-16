const express = require('express');
const router = express.Router();
const models = require('../Models');

router.post('/add', async (req, res) => {
  const userId = req.session.userId;
  const userLogin = req.session.userLogin;

  if (!userId || !userLogin) {
    res.json({
      ok: false
    })
  } 
  const {post, body, parent} = req.body;

  if (!body) {
    res.json({
      ok: false,
      error: 'Необходимо ввести комментарий'
    })
  }

  try {
    if (!parent) {
    await models.Comment.create({
      post,
      body,
      owner: userId
      });

      res.json({
        ok: true,
        owner: userLogin,        
      })
    } else {
      const parentComment = await models.Comment.findById(parent);

      if (!parentComment) {
        res.json({
          ok: false,
        });
      }

      const comment = await models.Comment.create({
        post,
        parent,
        body,
        owner: userId
      });

      const childrenOfParentComment = parentComment.children;
      childrenOfParentComment.push(comment.id)
      parentComment.children = childrenOfParentComment;
      await parentComment.save();

      res.json({
        ok: true,
        owner: userLogin,        
      })
    }
  }
  catch(e){
    res.json({
      ok: false
    })
  } 
});


module.exports = router; 