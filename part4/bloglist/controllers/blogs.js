const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({}).populate('user',{blogs: 0})
  response.json(blogList)
})

blogsRouter.post('/', async (request, response ) => {
  const body = request.body
  const usersInDb = await User.find({})
  if (usersInDb.length > 0) {
    const blogEntry = new Blog({
      author: body.author,
      url: body.url,
      likes: body.likes,
      title: body.title,
      user: usersInDb[0].id
    })
    const savedBlog = await blogEntry.save()
    usersInDb[0].blogs = usersInDb[0].blogs.concat(savedBlog._id)
    await usersInDb[0].save()
    response.status(201).json(savedBlog)
  } else {
    response.status(500).send({ error: 'could not find suitable user' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
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