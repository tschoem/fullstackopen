const mongoose = require('mongoose')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('returns all blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('uses .id as unique identifier', async () => {
    const response = await api.get('/api/blogs')
    const blog = new Blog(response.body[0]).toJSON()
    assert('id' in blog)
  })

  test('creates a new blog with POST request', async () => {
    const newBlog = {
      title: 'Robot wars',
      author: 'Isaac Asimov',
      url: 'http://blog.scifi.com/uncle-isaac/2016/05/01/irobot.html',
      likes: 24
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = new Blog(postResponse.body).toJSON()
    const { id, ...rest } = blog
    assert.deepStrictEqual(rest, newBlog)

    const response = await api.get('/api/blogs')
    assert(response.body.length, helper.initialBlogs.length + 1)

  })

  test('creates a blog entry with 0 likes if property is missing', async () => {
    const newBlog = {
      title: 'Robot wars',
      author: 'Isaac Asimov',
      url: 'http://blog.scifi.com/uncle-isaac/2016/05/01/irobot.html',
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = new Blog(postResponse.body).toJSON()
    const { id, likes, ...rest } = blog
    assert.deepStrictEqual(rest, newBlog)
    assert.strictEqual(likes,0)

  })

  after(async () => {
    await mongoose.connection.close()
  })
})