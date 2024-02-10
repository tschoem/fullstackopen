const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0
  )
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((favorite, blog) => favorite.likes > blog.likes ? favorite : blog)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}