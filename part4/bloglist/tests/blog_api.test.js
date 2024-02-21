const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('blog API with existing initial data', () => {

  let myToken

  beforeEach(async () => {
    await User.deleteMany({})
    const user = helper.initialUsers[0]
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(user.password, saltRounds)
    const userObject = new User({
      name: user.name,
      username: user.username,
      blogs: [],
      passwordHash: passwordHash
    })
    await userObject.save()

    const userForToken = {
      username: userObject.username,
      id: userObject._id,
    }

    myToken = jwt.sign(
      userForToken,
      process.env.SECRET,
      { expiresIn: 60 * 60 }
    )

    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog({
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
        url: blog.url,
        user: userObject
      })
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
      .set({ Authorization: `Bearer ${myToken}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = new Blog(postResponse.body).toJSON()
    const { id, user, ...rest } = blog
    assert.deepStrictEqual(rest, newBlog)

    const blogsInDb = await helper.blogsInDb()
    assert(blogsInDb.length, helper.initialBlogs.length + 1)

  })

  test('creation fails with 401 if token not provided', async () => {
    const newBlog = {
      title: 'Robot wars',
      author: 'Isaac Asimov',
      url: 'http://blog.scifi.com/uncle-isaac/2016/05/01/irobot.html',
      likes: 24
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsInDb = await helper.blogsInDb()
    assert(blogsInDb.length, helper.initialBlogs.length)

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
      .set({ Authorization: `Bearer ${myToken}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blog = new Blog(postResponse.body).toJSON()
    const { id, likes, user, ...rest } = blog
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
      .set({ Authorization: `Bearer ${myToken}` })
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
      .set({ Authorization: `Bearer ${myToken}` })
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
        .set({ Authorization: `Bearer ${myToken}` })
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
        .set({ Authorization: `Bearer ${myToken}` })
        .expect(401)

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