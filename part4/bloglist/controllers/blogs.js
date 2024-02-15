const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({})
  response.json(blogList)
})

blogsRouter.post('/', async (request, response ) => {
  const blog = new Blog(request.body)

  const returnedBlog = await blog.save()
  response.status(201).json(returnedBlog)

})

module.exports = blogsRouter