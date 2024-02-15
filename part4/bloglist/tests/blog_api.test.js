const mongoose = require('mongoose')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('blog API with existing initial data', () => {
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
    const blogsInDb = await helper.blogsInDb()

    assert.strictEqual(blogsInDb.length, helper.initialBlogs.length)
  })

  test('uses .id as unique identifier', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blog = new Blog(blogsInDb[0]).toJSON()
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

    const blogsInDb = await helper.blogsInDb()
    assert(blogsInDb.length, helper.initialBlogs.length + 1)

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
    assert.strictEqual(likes, 0)

  })

  test('blog creation returns 400 if missing title', async () => {
    const newBlog = {
      author: 'Isaac Asimov',
      url: 'http://blog.scifi.com/uncle-isaac/2016/05/01/irobot.html',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog creation returns 400 if missing url', async () => {
    const newBlog = {
      title: 'Robot wars',
      author: 'Isaac Asimov',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const ids = blogsAtEnd.map(r => r.id)
      assert(!ids.includes(blogToDelete.id))
    })

    test('returns status code 204 if id is missing', async () => {
      const invalidId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('editing a note', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToEdit = blogsAtStart[0]
      const newLikes = {
        likes: 99
      }

      await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(newLikes)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const modifiedBlog = blogsAtEnd.find((blog) => blog.id === blogToEdit.id)

      assert.strictEqual(modifiedBlog.likes, 99)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    })
    test('fails with status code 404 if id is missing', async () => {
      const invalidId = await helper.nonExistingId()
      const newLikes = {
        likes: 87
      }
      await api
        .put(`/api/blogs/${invalidId}`)
        .send(newLikes)
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})