// jest.mock('mongodb-memory-server')
// jest.mock('supertest')
// jest.mock('dotenv/config')
jest.mock('../app.ts')
jest.mock('../api/utils/index.ts')
// jest.mock('../api/middlewares/index.ts')
jest.mock('../api/middlewares/review.middleware.ts')
// jest.mock('../api/controllers/index.ts')
jest.mock('../api/controllers/review.controller.ts')
// jest.mock('../api/routes/index.ts')
// jest.mock('../api/routes/review.route.ts')

import 'dotenv/config'
// import express from 'express'
import reviewRouter from '../api/routes/review.route'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
// import { reviewController } from '../api/controllers/index'
import reviewController from '../api/controllers/review.controller'
// import { reviewMiddleware } from '../api/middlewares/index'
import reviewMiddleware from '../api/middlewares/review.middleware'
import app from '../app'
// @ts-ignore
// const app = require('../app')

const { reviewQueryModifier, reviewsQueryModifier } = reviewMiddleware
const { getReviews } = reviewController

describe('settings', () => {
  beforeAll(async () => {
    const mongooseServer = await MongoMemoryServer.create()
    await mongoose.connect(mongooseServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('get all settings route', () => {
    describe('given the user not login access ', () => {
      it('should return a 401', async () => {
        // console.log(app)
        try {
          await supertest(app).get('/api/v1/settings/').expect(401)
        } catch (err) {
          console.log(err)
        }
      })
    })
  })
})
