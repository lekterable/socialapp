const request = require('supertest')
const app = require('../../../app')
const mongoose = require('mongoose')

describe("Test '/api/posts' path", () => {
  afterAll(() => {
    mongoose.connection.db.dropDatabase()
  })
  describe('GET', () => {
    it('Should respond with a 200 status', done => {
      request(app)
        .get('/api/posts')
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
    it('Should respond with a success equal to true', done => {
      request(app)
        .get('/api/posts')
        .then(res => {
          expect(res.body.success).toBe(true)
          done()
        })
    })
    it('Should respond with a posts', done => {
      request(app)
        .get('/api/posts')
        .then(res => {
          expect(res.body.message).toEqual(expect.anything())
          done()
        })
    })
  })
  describe('POST', () => {
    describe('Unauthorized', () => {
      it('Should respond with a 401 status', done => {
        request(app)
          .post('/api/posts')
          .then(res => {
            expect(res.statusCode).toBe(401)
            done()
          })
      })
      it('Should respond with a success equal to false', done => {
        request(app)
          .post('/api/posts')
          .then(res => {
            expect(res.body.success).toBe(false)
            done()
          })
      })
      it("Should respond with a 'Log in' message", done => {
        request(app)
          .post('/api/posts')
          .then(res => {
            expect(res.body.message).toBe('Log in')
            done()
          })
      })
    })
    describe('Authorized', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjVhYzUwNzgxYjkwZTdlMjkwODY3ZTRlOSIsInVzZXJuYW1lIjoidGVzdCIsInBhc3N3b3JkIjoiJDJhJDEwJDdIRUUuZS43dUJkNUFuUmtRZzdqS2V5ZlJVVUY1VWlMTXM2LkpsbGF0RFhPQkx6TjJwL21lIiwiZW1haWwiOiJ0ZXN0IiwiX192IjowfSwiaWF0IjoxNTIyODYxOTc3fQ.5Mj6I_a_FUhlrFgUzMIxhJbmD5ynsWaOI3XpMZRnc0k'
      it('Should respond with a 400 status if no body provided', done => {
        request(app)
          .post('/api/posts')
          .set('x-auth', token)
          .then(res => {
            expect(res.statusCode).toBe(400)
            done()
          })
      })
      it('Should respond with a success equal to false if no body provided', done => {
        request(app)
          .post('/api/posts')
          .set('x-auth', token)
          .then(res => {
            expect(res.body.success).toBe(false)
            done()
          })
      })
      it("Should respond with a 'Bad request' message if no body provided", done => {
        request(app)
          .post('/api/posts')
          .set('x-auth', token)
          .then(res => {
            expect(res.body.message).toBe('Bad request')
            done()
          })
      })
      it('Should respond with a 201 status if body provided', done => {
        request(app)
          .post('/api/posts')
          .send({ body: 'test' })
          .set('x-auth', token)
          .then(res => {
            expect(res.statusCode).toBe(201)
            done()
          })
      })
      it('Should respond with a success equal to true if body provided', done => {
        request(app)
          .post('/api/posts')
          .send({ body: 'test' })
          .set('x-auth', token)
          .then(res => {
            expect(res.body.success).toBe(true)
            done()
          })
      })
      it('Should respond with a new post in message if body provided', done => {
        request(app)
          .post('/api/posts')
          .send({ body: 'test' })
          .set('x-auth', token)
          .then(res => {
            expect(res.body.message.body).toBe('test')
            done()
          })
      })
      it('Should add a new post to database if body provided', done => {
        request(app)
          .post('/api/posts')
          .send({ body: 'test' })
          .set('x-auth', token)
          .then(res => res.body.message.body)
          .then(res =>
            request(app)
              .get('/api/posts')
              .then(post => {
                expect(res).toBe(post.body.message[0].body)
                done()
              })
          )
      })
    })
  })
})
