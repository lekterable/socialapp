const router = require('express').Router()
const Post = require('../models/post')

router.get('/posts', function (req, res) {
  Post.find()
  .sort('-date')
  .exec(function (err, posts) {
    if (err)
      throw err
    return res.status(200).json({success: true, message: posts})
  })
})

router.post('/posts', function (req, res) {
  
  if(!req.auth)
    return res.status(401).json({success: false, message: 'Log in'})
  let post = new Post({
    author: {
      username: req.auth.username,
      email: req.auth.email
      },
    body: req.body.body
  })
  post.save(function (err, post) {
    if (err)
      return res.status(400).json({success: false, message: 'Bad request'})
    return res.status(201).json({success: true, message: post})
  })
})

module.exports = router
