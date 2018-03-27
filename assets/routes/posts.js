const router = require('express').Router()
let Post = require('../models/post')

router.get('/posts', function (req, res) {
  Post.find()
  .sort('-date')
  .exec(function (err, posts) {
    if (err)
      throw err
    res.json({success: true, message: posts})
  })
})

router.post('/posts', function (req, res) {
  if(!req.auth)
    return res.json({success: false, message: 'Zaloguj się!'})
  let post = new Post({
    author: {
      username: req.auth.username,
      email: req.auth.email
      },
    body: req.body.body
  })
  post.save(function (err, post) {
    if (err)
      throw err
    return res.json({success: true, message: post})
  })
})

module.exports = router
