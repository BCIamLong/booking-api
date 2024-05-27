jest.mock('dotenv/config')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../../utils/index.ts')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../database/models/guest.model')
jest.mock('../../services/auth.service')
jest.mock('../../database/redis')
jest.mock('../../utils/AppError')
jest.mock('../../services/guests.service')
jest.mock('../../../config/app.config')
// ! NOTICE THAT WITH THE MODULE NEARLY LIKE ONE LEVEL OF FOLDER LIKE THIS ../ THEN WE DO NOT NEED TO USE JEST MOCK MAYBE IT'S ALREADY IN JEST SCOPE AND IF WE CONTINUE MOCK AND IT CAN BE CONFLICT AND CAUSE ISSUES
// jest.mock('../auth.controller')

import 'dotenv/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../../database/models/user.model'
import Guest from '../../database/models/guest.model'
import authController from '../auth.controller'
import authService from '../../services/auth.service'
import guestsService from '../../services/guests.service'
import redis from '../../database/redis'
import AppError from '../../utils/AppError'
import appConfig from '../../../config/app.config'

const { login, signup, verifyEmail, loginWithGoogle } = authController
const { redisClient } = redis
const { CLIENT_ORIGIN } = appConfig

const req = {
  query: {},
  cookies: {
    'access-token': undefined,
    'refresh-token': undefined
  },
  headers: {},
  params: {
    id: 123
  },
  body: {}
}

// const res1 = {
//   json: jest.fn((x) => x)
// }

const res = {
  status: jest.fn().mockReturnThis(),
  // status: jest.fn((status: number) => res1),
  json: jest.fn((x) => x),
  cookie: jest.fn((x) => x),
  redirect: jest.fn((x) => x)
}
// const res = jest

const accessToken = '123456'

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
  verifyEmail: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('unit test for auth controller', () => {
  describe('test login function', () => {
    describe('given a false format email', () => {
      it('should return a 400', async () => {
        jest.spyOn(authService, 'loginService').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // // @ts-ignore
        // User.findOne.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })
        // // @ts-ignore
        // Guest.findOne.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

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
        jest.spyOn(authService, 'loginService').mockRejectedValueOnce({
          name: 'No users found with this email',
          statusCode: 404
        })
        // // @ts-ignore
        // User.findOne.mockImplementationOnce(() => undefined)
        // // @ts-ignore
        // Guest.findOne.mockImplementationOnce(() => undefined)

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

        jest.spyOn(authService, 'loginService').mockRejectedValueOnce({
          type: 'ValidationError',
          statusCode: 400
        })

        // @ts-ignore
        // User.schema.checkPwd = jest.fn().mockRejectedValueOnce({
        //   type: 'ValidationError',
        //   statusCode: 400
        // })

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
        // @ts-ignore
        bcrypt.compare.mockImplementationOnce(() => true)

        // @ts-ignore
        jwt.sign.mockImplementationOnce(() => accessToken)

        jest.spyOn(authController, 'signToken').mockImplementationOnce(() => accessToken)

        // @ts-ignore
        jest.spyOn(authService, 'loginService').mockImplementationOnce(() => guestItem)
        // jest.spyOn(authService, 'loginService').mockImplementationOnce(() => new Guest(guestItem))

        // @ts-ignore
        await login(req, res)
        // @ts-ignore
        expect(res.json).toHaveBeenCalledTimes(1)
        // // @ts-ignore
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
        bcrypt.hash.mockImplementationOnce(() => '12345678')

        // @ts-ignore
        jwt.sign.mockImplementationOnce(() => accessToken)

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

  describe('test loginWithGoogle function', () => {
    describe('given no code on request query', () => {
      it('should return a bad request of 400', async () => {
        jest.spyOn(authService, 'getGoogleOauthTokens').mockRejectedValueOnce({
          error: 'Bad request',
          statusCode: 400
        })
        try {
          // @ts-ignore
          expect(await loginWithGoogle(req, res)).rejects.toThrow()
        } catch (err: any) {
          // console.log(err)
          expect(err.statusCode).toBe(400)
          expect(err.error).toBe('Bad request')
        }
      })
    })

    describe('given a code but with wrong oauth tokens', () => {
      it('should return a bad request of 400', async () => {
        jest
          .spyOn(authService, 'getGoogleOauthTokens')
          // @ts-ignore
          .mockImplementationOnce(() => ({ id_token: 'wrong_id_token', access_token: 'wrong_access_token' }))

        jest.spyOn(authService, 'getGoogleUser').mockRejectedValueOnce({
          error: 'Bad request',
          statusCode: 400
        })

        const req1 = {
          ...req,
          query: {
            code: 'valid_code'
          }
        }

        try {
          // @ts-ignore
          expect(await loginWithGoogle(req1, res)).rejects.toThrow()
        } catch (err: any) {
          // console.log(err)
          expect(err.statusCode).toBe(400)
          expect(err.error).toBe('Bad request')
        }
      })
    })

    describe("given a valid code with valid tokens but user doesn't verify email ", () => {
      it('should return a forbidden 403', async () => {
        jest
          .spyOn(authService, 'getGoogleOauthTokens')
          // @ts-ignore
          .mockImplementationOnce(() => ({ id_token: 'valid_id_token', access_token: 'valid_access_token' }))

        jest
          .spyOn(authService, 'getGoogleUser')
          // @ts-ignore
          .mockImplementationOnce(() => ({
            email: 'user@example.come',
            name: 'user_name',
            verified_email: false
          }))

        const req1 = {
          ...req,
          query: {
            code: 'valid_code'
          }
        }

        try {
          // *WE CAN TEST IN THE CASE ERROR LIKE THIS MAYBE WHEN WE DEAL WITH THE ERROR WHICH IS WE CUSTOM
          // *MAYBE DEPEND ON MANY CASES IF WE CAN'T CHECK THE ERROR IN THE CATCH BLOCK THEN WE CAN TEST THE ERROR CASES LIKE THIS
          // @ts-ignore
          expect(await loginWithGoogle(req1, res)).rejects.toThrow()
          expect(AppError).toHaveBeenCalledTimes(1)
          expect(AppError).toHaveBeenCalledWith(
            403,
            'Google account is not verified, please verify your google account to continue!'
          )
        } catch (err: any) {
          // console.log(err)
          // expect(err.statusCode).toBe(403)
        }
      })
    })

    describe('given a valid code with valid tokens and user is already verify email ', () => {
      it('should be work, the user login success and redirect to the homepage', async () => {
        jest
          .spyOn(authService, 'getGoogleOauthTokens')
          // @ts-ignore
          .mockImplementationOnce(() => ({ id_token: 'valid_id_token', access_token: 'valid_access_token' }))

        jest
          .spyOn(authService, 'getGoogleUser')
          // @ts-ignore
          .mockImplementationOnce(() => ({
            email: 'user@example.come',
            name: 'user_name',
            verified_email: true
          }))

        // @ts-ignore
        jest.spyOn(guestsService, 'findAndUpdateGuest').mockImplementationOnce(() => guestItem)

        // @ts-ignore
        jwt.sign.mockImplementationOnce(() => 'token')

        const req1 = {
          ...req,
          query: {
            code: 'valid_code'
          }
        }
        // @ts-ignore
        await loginWithGoogle(req1, res)

        expect(res.cookie).toHaveBeenCalledTimes(2)
        expect(res.redirect).toHaveBeenCalledTimes(1)
        expect(res.redirect).toHaveBeenCalledWith(CLIENT_ORIGIN)
      })
    })
  })

  describe('test verifyEmail function', () => {
    describe('given no token and no user session', () => {
      it('should return a 400 bad request', async () => {
        // @ts-ignore
        redisClient.get.mockImplementationOnce(() => undefined)

        // @ts-ignore
        // expect(await verifyEmail(req, res)).rejects.toThrow('Bad request')
        try {
          // @ts-ignore
          await expect(verifyEmail(req, res)).rejects.toThrow()
          expect(AppError).toHaveBeenCalledTimes(1)
          expect(AppError).toHaveBeenCalledWith(400, 'Bad request')
        } catch (err: any) {
          // console.log('ok')
          // expect(err.statusCode).toBe(400)
        }
      })
    })
    describe('given no token but have an user session', () => {
      it('should work and return nothing', async () => {
        // @ts-ignore
        redisClient.get.mockImplementationOnce(() => JSON.stringify(guestItem))
        // @ts-ignore
        jest.spyOn(guestsService, 'editGuest').mockImplementationOnce(() => guestItem)
        try {
          // @ts-ignore
          await verifyEmail(req, res)
          expect(res.redirect).toHaveBeenCalledTimes(1)
          expect(res.redirect).toHaveBeenCalledWith(CLIENT_ORIGIN)
        } catch (err: any) {
          // console.log(err.message)
          // console.log(err.statusCode)
        }
      })
    })
    // describe('given an invalid token', () => {
    //   it('should return a 500 invalid token', async () => {
    //     // @ts-ignore
    //     jwt.verify.mockRejectedValueOnce({
    //       type: 'InvalidToken',
    //       statusCode: 500
    //     })
    //     // @ts-ignore
    //     // redisClient.get.mockImplementationOnce(() => undefined)

    //     // @ts-ignore
    //     // jest.spyOn(guestsService, 'editGuest').mockRejectedValueOnce({
    //     //   type: 'InvalidToken',
    //     //   statusCode: 500
    //     // })

    //     const req1 = {
    //       ...req,
    //       headers: {
    //         authorization: 'Bearer invalid_bearer_token'
    //       },
    //       cookies: {
    //         'access-token': 'invalid_access_token',
    //         'refresh-token': 'invalid_refresh_token'
    //       }
    //     }
    //     try {
    //       // @ts-ignore
    //       expect(await verifyEmail(req1, res)).rejects.toThrow()
    //     } catch (err: any) {
    //       console.log(err)
    //       expect(err.statusCode).toBe(500)
    //     }
    //   })
    // })

    describe('given a valid token', () => {
      it('should be work and return nothing', async () => {
        // @ts-ignore
        jwt.verify.mockImplementationOnce(() => ({
          id: guestItem._id
        }))
        // @ts-ignore
        jest.spyOn(guestsService, 'editGuest').mockImplementationOnce(() => guestItem)
        const req1 = {
          ...req,
          headers: {
            authorization: 'Bearer 123'
          },
          cookies: {
            'access-token': '123',
            'refresh-token': '123'
          }
        }
        try {
          // @ts-ignore
          await verifyEmail(req1, res)

          expect(res.redirect).toHaveBeenCalledTimes(1)
          expect(res.redirect).toHaveBeenCalledWith(CLIENT_ORIGIN)
        } catch (err: any) {
          // console.log(err.statusCode)
        }
      })
    })
  })
})
