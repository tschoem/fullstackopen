const blog = require('../models/blog')
var _ = require('lodash')

const dummy = () => {
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

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? {}
    : _.chain(blogs)
      .countBy('author')
      .map((cnt, author) => {
        return {
          author: author,
          blogs: cnt
        }
      })
      .sortBy('blogs')
      .last()
      .value()
}

const mostLikes = (blogs) => {
  return blogs.length === 0
    ? {}
    : _.chain(blogs)
      .groupBy('author')
      .map((details, author) => {
        return {
          author: author,
          likes: _.sumBy(details,'likes')
        }
      })
      .sortBy('likes')
      .last()
      .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}