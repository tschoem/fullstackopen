const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogList)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid or missing token' })
  }

  const blogEntry = new Blog({
    author: body.author,
    url: body.url,
    likes: body.likes,
    title: body.title,
    user: user.id
  })
  const savedBlog = await blogEntry.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (!user) {
    return response.status(401).json({ error: 'invalid or missing token' })
  }

  if (!blogToDelete) {
    return response.status(401).json({ error: 'wrong id provided' })
  }

  if ( blogToDelete.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } else {
    return response.status(401).json({ error: 'wrong token provided' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter