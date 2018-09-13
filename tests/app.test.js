const request = require('supertest')
const app = require('../app')

describe("Test '/' path", () => {
  describe('GET', () => {
    it('Should respond with a 200 status', done => {
      request(app)
        .get('/')
        .then(res => {
          expect(res.statusCode).toBe(200)
          done()
        })
    })
  })
})
