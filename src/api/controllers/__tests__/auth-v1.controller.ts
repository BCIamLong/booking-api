// ! Remember in jest runtime we can't import modules like import jwt from 'jsonwebtoken'
// * Instead we need to use jest mock then import
// jest.mock('jsonwebtoken') //* to mock this module to jest scope
// import jwt from 'jsonwebtoken' //* import this module from that jest scope

// jest.mock('jsonwebtoken')
// jest.mock('bcrypt')
jest.mock('dotenv/config')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../database/models/guest.model.ts')
jest.mock('../../../config/jwt.config.ts')
jest.mock('../auth.controller.ts')
jest.mock('../../services/auth.service.ts')

// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
import 'dotenv/config'
import User from '../../database/models/user.model'
import Guest from '../../database/models/guest.model'
import authController from '../auth.controller'
import authService from '../../services/auth.service'
// import jwtConfig from '../../../config/jwt.config'

const { login, signup } = authController
// const { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET } = jwtConfig

const userItem = {
  _id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPwd(password123)',
  createdAt: new Date(),
  updatedAt: new Date()
}

const guestItem = {
  _id: 'f10e695b-14df-4fe0-a944-fcf8e473e614',
  fullName: 'Alice Johnson',
  email: 'alice.johnson@example.com',
  nationalId: '456789123',
  nationality: 'UK',
  password: 'hashedPwd(password123)',
  countryFlag: '🇬🇧',
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

// const mockResponse = () => {
//   const res = {}
//   // @ts-ignore
//   res.status = jest.fn().mockReturnValue(res)
//   // @ts-ignore
//   res.json = jest.fn().mockReturnValue(res)
//   // @ts-ignore
//   res.cookie = jest.fn((x) => x)
//   return res
// }
// const res = mockResponse()

// @ts-ignore
const res = {
  // @ts-ignore
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
        // @ts-ignore
        Guest.findOne.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await login(req, res)
        } catch (err: any) {
          // @ts-ignore
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a true format email but email is not exist', () => {
      it('should return a 404', async () => {
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await login(req, res)
        } catch (err: any) {
          // @ts-ignore
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid email and a wrong password or a wrong format password', () => {
      it('should return a 400', async () => {
        const userQuery = {
          cache: jest.fn().mockImplementationOnce(() => userItem)
        }

        const guestQuery = {
          cache: jest.fn().mockImplementationOnce(() => guestItem)
        }

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)
        // @ts-ignore
        User.schema.checkPwd = jest.fn().mockRejectedValueOnce({
          type: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await login(req, res)
        } catch (err: any) {
          // @ts-ignore
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
        // jwt.sign.mockImplementationOnce(() => accessToken)

        jest.spyOn(authController, 'signToken').mockImplementationOnce(() => accessToken)

        // // @ts-ignore
        // User.schema.methods.checkPwd = jest.fn().mockImplementationOnce(() => true)
        // // @ts-ignore
        // Guest.schema.methods.checkPwd = jest.fn().mockImplementationOnce(() => true)

        // const userQuery = {
        //   cache: jest.fn().mockImplementationOnce(() => userItem)
        // }

        // const guestQuery = {
        //   cache: jest.fn().mockImplementationOnce(() => guestItem)
        // }

        // // @ts-ignore
        // User.findOne.mockImplementationOnce(() => userQuery)
        // // @ts-ignore
        // Guest.findOne.mockImplementationOnce(() => guestQuery)
        // @ts-ignore
        jest.spyOn(authService, 'loginService').mockImplementationOnce(() => new Guest(guestItem))

        // @ts-ignore
        await login(req, res)
        // @ts-ignore
        expect(res.json).toHaveBeenCalledTimes(1)
        // // @ts-ignore
        expect(res.cookie).toHaveBeenCalledTimes(2)
        // @ts-ignore
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
        User.findOne.mockImplementationOnce(() => undefined)

        // @ts-ignore
        Guest.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await signup(req, res)
        } catch (err: any) {
          // @ts-ignore
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given email already exist', () => {
      it('should return a 409', async () => {
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userItem)
        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })

        try {
          // @ts-ignore
          await signup(req, res)
        } catch (err: any) {
          // @ts-ignore
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given the invalid password confirm', () => {
      it('should return a 400', async () => {
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)

        // @ts-ignore
        Guest.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await signup(req, res)
        } catch (err: any) {
          // @ts-ignore
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a 200 and access token', async () => {
        // @ts-ignore
        // bcrypt.hash.mockImplementationOnce(() => '12345678')

        // @ts-ignore
        // jwt.sign.mockImplementationOnce(() => accessToken)

        jest.spyOn(authController, 'signToken').mockImplementationOnce(() => accessToken)

        // @ts-ignore
        // User.findOne.mockImplementationOnce(() => undefined)

        // const guestQuery = {
        //   cache: jest.fn().mockImplementationOnce(() => new Guest(guestItem))
        // }

        // // @ts-ignore
        // Guest.findOneAndUpdate.mockImplementationOnce(() => guestQuery)
        jest.spyOn(authService, 'signupService').mockImplementationOnce(() => new Guest(guestItem))

        // @ts-ignore
        await signup(req, res)
        // @ts-ignore
        expect(res.json).toHaveBeenCalledTimes(1)
        // @ts-ignore
        expect(res.cookie).toHaveBeenCalledTimes(2)
        // @ts-ignore
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          token: accessToken
          //   token: expect.any(String)
        })
      })
    })
  })
})
