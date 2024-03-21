jest.mock('jsonwebtoken')
jest.mock('bcrypt')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../../config/jwt.config.ts')
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../../database/models/user.model'
import authController from '../auth.controller'
import jwtConfig from '../../../config/jwt.config'

const { login, signup } = authController
const { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET } = jwtConfig

const userItem = {
  _id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPwd(password123)',
  createdAt: new Date(),
  updatedAt: new Date()
}
const accessToken = '123456'

const req = {
  params: {
    id: 123
  },
  body: {
    email: 'john@example.com',
    password: 'hashedPwd(password123)'
  }
}

const res = {
  status: jest.fn().mockReturnThis(),
  // status: jest.fn((status: number) => res1),
  json: jest.fn((x) => x),
  cookie: jest.fn((x) => x)
}

describe('unit test for auth controller', () => {
  describe('test login function', () => {
    describe('given a false format email', () => {
      it('should return a 400', async () => {
        // @ts-ignore
        User.findOne.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await login(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a true format email but email is not exist', () => {
      it('should return a 404', async () => {
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await login(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid email and a wrong password or a wrong format password', () => {
      it('should return a 400', async () => {
        // @ts-ignore
        User.findOne.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await login(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid email and a valid password', () => {
      it('should return a 200 and access token', async () => {
        // const accessToken = jwt.sign({ id: 'user1' }, ACCESS_TOKEN_SECRET!, {
        //   expiresIn: +ACCESS_TOKEN_EXPIRES!
        // })
        // @ts-ignore
        // bcrypt.compare.mockImplementationOnce(() => true)

        // @ts-ignore
        jwt.sign.mockImplementationOnce(() => accessToken)

        jest.spyOn(authController, 'signToken').mockImplementationOnce(() => accessToken)

        // @ts-ignore
        User.schema.methods.checkPwd.mockImplementationOnce(() => true)
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => new User(userItem))

        // @ts-ignore
        await login(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.cookie).toHaveBeenCalledTimes(2)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          token: accessToken
          //   token: expect.any(String)
        })
      })
    })
  })

  describe('test signup function', () => {
    describe('given the invalid input', () => {
      it('should return a 400', async () => {
        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await signup(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given email already exist', () => {
      it('should return a 409', async () => {
        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })

        try {
          // @ts-ignore
          await signup(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given the invalid password confirm', () => {
      it('should return a 400', async () => {
        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await signup(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a 200 and access token', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => '12345678')

        // @ts-ignore
        jwt.sign.mockImplementationOnce(() => accessToken)

        jest.spyOn(authController, 'signToken').mockImplementationOnce(() => accessToken)

        // @ts-ignore
        User.create.mockImplementationOnce(() => new User(userItem))

        // @ts-ignore
        await signup(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.cookie).toHaveBeenCalledTimes(2)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          token: accessToken
          //   token: expect.any(String)
        })
      })
    })
  })
})
