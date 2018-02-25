const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

blogSchema.statics.format = (blog) => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    userId: blog.userId
  }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
