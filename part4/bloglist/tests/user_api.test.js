const mongoose = require('mongoose')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('user API without any existing initial data', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('returns users as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  describe('user creation', () => {
    test('succeeds with POST request', async () => {
      const newUser = {
        username: 'tom_smith',
        name: 'Thomas Smith',
        password: 'password'
      }

      const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const user = new User(postResponse.body).toJSON()
      const { id, blogs, ...rest } = user
      const { password, ...restUser } = newUser
      assert.deepStrictEqual(rest, restUser)

      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, 1)

    })

    test('returns error 400 if duplicate username', async () => {
      const newUser = {
        username: 'tom_smith',
        name: 'Thomas Smith',
        password: 'password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const nextUser = {
        username: 'tom_smith',
        name: 'Thomas Smithwick',
        password: 'password2'
      }

      await api
        .post('/api/users')
        .send(nextUser)
        .expect(400)

      const usersInDb = await helper.usersInDb()
      assert(usersInDb.length, 1)

    })

    test('returns error 400 if short username', async () => {
      const newUser = {
        username: 'to',
        name: 'Thomas Smith',
        password: 'password'
      }

      const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(postResponse.body.error.includes('parameters should be at least 3 characters long'))

      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, 0)

    })

    test('returns error 400 if short password', async () => {
      const newUser = {
        username: 'tom_3',
        name: 'Thomas Shoe',
        password: 'pa'
      }

      const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(postResponse.body.error.includes('parameters should be at least 3 characters long'))

      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, 0)

    })
  })
})

describe('user API with existing initial data', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for (let user of helper.initialUsers) {
      await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }
  })

  test('returns all users', async () => {
    const usersInDb = await helper.usersInDb()

    assert.strictEqual(usersInDb.length, helper.initialUsers.length)
  })

  test('uses .id as unique identifier', async () => {
    const usersInDb = await helper.usersInDb()
    const user = new User(usersInDb[0]).toJSON()
    assert('id' in user)
  })

  describe('user creation', () => {
    test('returns 400 if missing username', async () => {
      const newUser = {
        name: 'Thomas Shoe',
        password: 'password'
      }

      const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(postResponse.body.error.includes('missing arguments. username and password must be provided'))

      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, helper.initialUsers.length)

    })

    test('returns 400 if missing password', async () => {
      const newUser = {
        username: 'billy',
        name: 'Thomas Bill'
      }

      const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(postResponse.body.error.includes('missing arguments. username and password must be provided'))

      const usersInDb = await helper.usersInDb()
      assert.strictEqual(usersInDb.length, helper.initialUsers.length)

    })
  })
})

after(async () => {
  await mongoose.connection.close()
})