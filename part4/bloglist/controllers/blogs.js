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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter