const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    var sum = 0
    blogs.forEach(blog => {
      sum = sum + blog.likes
    })
    return sum
}

const favoriteBlog = (blogs) => {
  const favBlog = {
    author: '',
    title: '',
    likes: ''
  }
  const noBlogs = 'The list of blogs is empty.'
  if (blogs.length === 0) {
    return noBlogs
  }
  blogs.forEach(blog=> {
    if (blog.likes > favBlog.likes) {
      favBlog.author = blog.author,
      favBlog.title = blog.title,
      favBlog.likes = blog.likes
      }
  })
  return favBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 'The list of blogs is empty.'
  }

  let bloggers = {}
  blogs.forEach(blog => {
    if (bloggers[blog.author] === undefined) {
      bloggers[blog.author] = 1;
    } else {
      bloggers[blog.author] = bloggers[blog.author] + 1
    }
  })

  const mostBlogsBlogger = {
    author: '',
    blogs: 0
  }

  for(let key in bloggers){
    if (bloggers[key] > mostBlogsBlogger.blogs) {
      mostBlogsBlogger.author = key
      mostBlogsBlogger.blogs = bloggers[key]
    }
  }

  return mostBlogsBlogger
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'The list of blogs is empty.'
  }

  let bloggers = {}
  blogs.forEach(blog => {
    if (bloggers[blog.author] === undefined) {
      bloggers[blog.author] = blog.likes;
    } else {
      bloggers[blog.author] = bloggers[blog.author] + blog.likes
    }
  })

  const mostVotes = {
    author: '',
    votes: 0
  }

  for(let key in bloggers){
    if (bloggers[key] > mostVotes.votes) {
      mostVotes.author = key
      mostVotes.votes = bloggers[key]
    }
  }

  return mostVotes
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
