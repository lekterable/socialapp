const request = require('supertest')
const app = require('../../../app')
const mongoose = require('mongoose')

describe("Test '/api/users' path", () => {
  afterEach(() => {
    mongoose.connection.db.dropDatabase()
  })
  describe("Test '/authenticate' path", () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjVhYzUwNzgxYjkwZTdlMjkwODY3ZTRlOSIsInVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiJDJhJDEwJDdIRUUuZS43dUJkNUFuUmtRZzdqS2V5ZlJVVUY1VWlMTXM2LkpsbGF0RFhPQkx6TjJwL21lIiwiZW1haWwiOiJ0ZXN0IiwiX192IjowfSwiaWF0IjoxNTIyODYxOTc3fQ.5Mj6I_a_FUhlrFgUzMIxhJbmD5ynsWaOI3XpMZRnc0k'
    it('Should respond with a 400 status if no header provided', done => {
      request(app)
        .get('/api/users/authenticate')
        .then(res => {
          expect(res.statusCode).toBe(400)
          done()
        })
    })
    it('Should respond with a success equal to false', done => {
      request(app)
        .get('/api/users/authenticate')
        .then(res => {
          expect(res.body.success).toBe(false)
          done()
        })
    })
    it("Should respond with a 'Invalid token' message", done => {
      request(app)
        .get('/api/users/authenticate')
        .then(res => {
          expect(res.body.message).toBe('Invalid token')
          done()
        })
    })
    it('Should respond with a 400 status if invalid header provided', done => {
      request(app)
        .get('/api/users/authenticate')
        .set('x-auth', 'invalid')
        .then(res => {
          expect(res.statusCode).toBe(400)
          done()
        })
    })
    it('Should respond with a success equal to true if invalid header provided', done => {
      request(app)
        .get('/api/users/authenticate')
        .set('x-auth', 'invalid')
        .then(res => {
          expect(res.body.success).toBe(false)
          done()
        })
    })
    it("Should respond with a 'Invalid token' message if invalid header provided", done => {
      request(app)
        .get('/api/users/authenticate')
        .set('x-auth', 'invalid')
        .then(res => {
          expect(res.body.message).toBe('Invalid token')
          done()
        })
    })
    it('Should respond with a 200 status if valid header provided', done => {
      request(app)
        .get('/api/users/authenticate')
        .set('x-auth', token)
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
    it('Should respond with a success equal to true if valid header provided', done => {
      request(app)
        .get('/api/users/authenticate')
        .set('x-auth', token)
        .then(res => {
          expect(res.body.success).toBe(true)
          done()
        })
    })
    it('Should respond with data if valid header provided', done => {
      request(app)
        .get('/api/users/authenticate')
        .set('x-auth', token)
        .then(res => {
          expect(res.body.message).toEqual(expect.anything())
          done()
        })
    })
  })
  describe("Test '/register path", () => {
    it('Should respond with a 400 status if no body provided', done => {
      request(app)
        .post('/api/users/register')
        .then(res => {
          expect(res.statusCode).toBe(400)
          done()
        })
    })
    it('Should respond with a success equal to false if no body provided', done => {
      request(app)
        .post('/api/users/register')
        .then(res => {
          expect(res.body.success).toBe(false)
          done()
        })
    })
    it("Should respond with a 'Fill all required fields' message if no body provided", done => {
      request(app)
        .post('/api/users/register')
        .then(res => {
          expect(res.body.message).toBe('Fill all required fields')
          done()
        })
    })
    it('Should respond with a 200 status if body provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
    it('Should respond with a success equal to true if body provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(res => {
          expect(res.body.success).toBe(true)
          done()
        })
    })
    it("Should respond with a 'Registered' message if body provided", done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(res => {
          expect(res.body.message).toBe('Registered')
          done()
        })
    })
  })
  describe("Test '/login' path", () => {
    it('Should respond with a 400 status if no body provided', done => {
      request(app)
        .post('/api/users/login')
        .then(res => {
          expect(res.statusCode).toBe(400)
          done()
        })
    })
    it('Should respond with a success equal to false if no body provided', done => {
      request(app)
        .post('/api/users/login')
        .then(res => {
          expect(res.body.success).toBe(false)
          done()
        })
    })
    it("Should respond with a 'No username or password provided' message if no body provided", done => {
      request(app)
        .post('/api/users/login')
        .then(res => {
          expect(res.body.message).toBe('No username or password provided')
          done()
        })
    })
    it('Should respond with a 400 status if invalid username provided', done => {
      request(app)
        .post('/api/users/login')
        .send({ username: 'wrong', password: 'test' })
        .then(res => {
          expect(res.statusCode).toBe(400)
          done()
        })
    })
    it('Should respond with a success equal to false if invalid username provided', done => {
      request(app)
        .post('/api/users/login')
        .send({ username: 'wrong', password: 'test' })
        .then(res => {
          expect(res.body.success).toBe(false)
          done()
        })
    })
    it("Should respond with a 'User not found' message if invalid username provided", done => {
      request(app)
        .post('/api/users/login')
        .send({ username: 'wrong', password: 'test' })
        .then(res => {
          expect(res.body.message).toBe('User not found')
          done()
        })
    })
    it('Should respond with a 400 status if invalid password provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({ username: 'test', password: 'wrong' })
            .then(res => {
              expect(res.statusCode).toBe(400)
              done()
            })
        })
    })
    it('Should respond with a success equal to false if invalid password provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({ username: 'test', password: 'wrong' })
            .then(res => {
              expect(res.body.success).toBe(false)
              done()
            })
        })
    })
    it("Should respond with a 'Invalid password' message if invalid password provided", done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({ username: 'test', password: 'wrong' })
            .then(res => {
              expect(res.body.message).toBe('Invalid password')
              done()
            })
        })
    })
    it('Should respond with a 200 status if credentials provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({ username: 'test', password: 'test' })
            .then(res => {
              expect(res.statusCode).toBe(200)
              done()
            })
        })
    })
    it('Should respond with a success equal to true if credentials provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({ username: 'test', password: 'test' })
            .then(res => {
              expect(res.body.success).toBe(true)
              done()
            })
        })
    })
    it('Should respond with a Token message if credentials provided', done => {
      request(app)
        .post('/api/users/register')
        .send({ username: 'test', password: 'test', email: 'test@test.com' })
        .then(() => {
          request(app)
            .post('/api/users/login')
            .send({ username: 'test', password: 'test' })
            .then(res => {
              expect(res.body.message).toEqual(expect.anything())
              done()
            })
        })
    })
  })
})
