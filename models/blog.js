const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v
  }
})


module.exports = mongoose.model('Blog', blogSchema)
