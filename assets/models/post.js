const mongoose = require('mongoose')

let PostSchema = mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Post', PostSchema)
