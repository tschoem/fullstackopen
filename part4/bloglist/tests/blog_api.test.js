const mongoose = require('mongoose')
const { test, describe, beforeEach, after  } = require('node:test')
const assert = require('node:assert')
require('express-async-errors')
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

    assert.strictEqual(response.body.length,helper.initialBlogs.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})