// ! DON'T USE jest.mock('mongoose') IT WILL CAUSE SOME ISSUES MAYBE BECAUSE THE WAY MONGOOSE WORK WITH JEST
// ! if we mock mongoose here then it can cause some conflict remember in user model or guest model we already import that mongoose then if we import again then it can cause conflict then create many problem
// ! but maybe we will know about that more later

// * Remember that in test development we just mock everything and fake that we don't need to require something like require the Query from mongoose then create new Query instead we just create an object then contain method we want right
// * unless in the case we really need that data must be create from that Query constructor or something like that then maybe we need to require something from libraries or packages

jest.mock('bcrypt')
jest.mock('axios')
jest.mock('../auth.service')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../database/models/guest.model.ts')

import bcrypt from 'bcrypt'
import axios from 'axios'
import User from '../../database/models/user.model'
import Guest from '../../database/models/guest.model'
import authService from '../auth.service'

const { loginService, signupService, checkEmailExist, getGoogleOauthTokens, getGoogleUser } = authService

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

const signupInput = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
}

const loginInput = {
  name: 'John Doe',
  email: 'john@example.com'
}

describe('unit test for users service', () => {
  describe('loginService', () => {
    describe('given a false format email', () => {
      it('should return an error with status code of 400', async () => {
        const userQuery = {
          cache: jest.fn().mockRejectedValueOnce({
            name: 'ValidationError',
            statusCode: 400
          })
        }

        const guestQuery = {
          cache: jest.fn().mockRejectedValueOnce({
            name: 'ValidationError',
            statusCode: 400
          })
        }

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)

        try {
          await loginService('user@example.com', 'password')
        } catch (err: any) {
          console.log(err)
          expect(err.statusCode).toBe(400)
        }
      })
    })
    describe('given a true format email but email is not exist', () => {
      it('should return an error with status code of 404', async () => {
        const userQuery = {
          cache: jest.fn().mockImplementationOnce(() => undefined)
        }

        const guestQuery = {
          cache: jest.fn().mockImplementationOnce(() => undefined)
        }

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)

        try {
          await loginService('user@example.com', 'password')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })
    describe('given a valid email and a wrong password or a wrong format password', () => {
      it('should return an user', async () => {
        const userQuery = {
          cache: jest.fn().mockRejectedValueOnce({
            name: 'ValidationError',
            statusCode: 400
          })
        }

        const guestQuery = {
          cache: jest.fn().mockRejectedValueOnce({
            name: 'ValidationError',
            statusCode: 400
          })
        }

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)

        try {
          await loginService('user@example.com', 'password')
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })
    describe('given a valid email and a valid password', () => {
      it('should return an user', async () => {
        // !
        // @ts-ignore
        // bcrypt.compare.mockImplementationOnce(() => true)
        // @ts-ignore
        User.schema.methods.checkPwd.mockImplementationOnce(() => true)

        // @ts-ignore
        Guest.schema.methods.checkPwd.mockImplementationOnce(() => true)

        // @ts-ignore
        // User.findOne.mockImplementationOnce(() => new User(userItem))
        // @ts-ignore
        // Guest.findOne.mockImplementationOnce(() => new Guest(guestItem))

        const userDoc = new User(userItem)
        const guestDoc = new Guest(guestItem)
        // @ts-ignore
        userDoc.checkPwd = jest.fn(() => true)
        // @ts-ignore
        guestDoc.checkPwd = jest.fn(() => true)

        const userQuery = {
          cache: jest.fn().mockImplementationOnce(() => userDoc)
        }

        const guestQuery = {
          cache: jest.fn().mockImplementationOnce(() => guestDoc)
        }

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)

        try {
          const user = await loginService('john@example.com', 'password123')
          // console.log(user)
          expect(user).toEqual(userDoc)
        } catch (err: any) {
          // console.log(err)
        }
      })
    })
  })

  describe('signupService', () => {
    describe('given the invalid input', () => {
      it('should return an error with 400 status code', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => '123456789')

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)

        const guestQuery = {
          cache: jest.fn().mockRejectedValueOnce({
            name: 'ValidationError',
            statusCode: 400
          })
        }

        // @ts-ignore
        Guest.findOneAndUpdate.mockImplementationOnce(() => guestQuery)

        try {
          // @ts-ignore
          await signupService(signupInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the email is already exist', () => {
      it('should return an error with 409 status code', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => '123456789')

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userItem)

        try {
          // @ts-ignore
          await signupService(signupInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a new user', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => '123456789')
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)
        // @ts-ignore
        // Guest.create.mockImplementationOnce(() => guestItem)
        // Guest.findOneAndUpdate = jest.fn().mockImplementation(() => Promise.resolve(guestItem))

        const guestDoc = new Guest(guestItem)
        // @ts-ignore
        guestDoc.checkPwd = jest.fn(() => true)

        const guestQuery = {
          cache: jest.fn().mockImplementationOnce(() => guestDoc)
        }

        // @ts-ignore
        Guest.findOneAndUpdate = jest.fn().mockImplementationOnce(() => guestQuery)

        try {
          // @ts-ignore
          const newUser = await signupService(signupInput)
          // console.log(newUser)
          expect(newUser).toEqual(guestDoc)
        } catch (err: any) {
          // console.log(err)
        }

        // expect([userItem, guestItem]).toContainEqual(newUser)
      })
    })
  })

  describe('checkEmailExist', () => {
    describe('given an user is already exist in the guests collection', () => {
      it('should return a 409 error', async () => {
        const guestQuery = {
          cache: jest.fn().mockImplementationOnce(() => guestItem)
        }

        // @ts-ignore
        Guest.findOneAndUpdate.mockImplementationOnce(() => guestQuery)

        try {
          await checkEmailExist('user', 'user@example.come')
        } catch (err: any) {
          console.log(err)
          expect(err.statusCode).toBe(409)
        }
      })
    })
    describe('given an user is already exist in the users collection', () => {
      it('should return a 409 error', async () => {
        const userQuery = {
          cache: jest.fn().mockImplementationOnce(() => userItem)
        }
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)

        try {
          await checkEmailExist('admin', 'admin@example.come')
        } catch (err: any) {
          expect(err.statusCode).toBe(409)
        }
      })
    })
    describe("given an user doesn't exist in the guests and users collection", () => {
      it('should return nothing', async () => {
        const userQuery = {
          cache: jest.fn().mockImplementationOnce(() => undefined)
        }
        const guestQuery = {
          cache: jest.fn().mockImplementationOnce(() => undefined)
        }

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)

        const data1 = await checkEmailExist('user', 'user@example.come')
        const data2 = await checkEmailExist('admin', 'admin@example.come')

        expect(data1).toBe(undefined)
        expect(data2).toBe(undefined)
      })
    })
  })

  describe('getGoogleOauthTokens', () => {
    //   describe('given the invalid code', () => {
    //     it('should return a bad request 400', async () => {
    //       // @ts-ignore
    //       axios.post.mockRejectedValueOnce(new Error('Bad Request'))
    //       expect(await getGoogleOauthTokens({ code: '123' })).rejects.toThrow('Bad Request')
    //     })
    //   })
    //   describe('given the valid code', () => {
    //     it('should return a token data', async () => {
    //       const data_tmp = {
    //         id_token: 'id_token',
    //         access_token: 'access_token'
    //       }
    //       // @ts-ignore
    //       axios.post = jest.fn().mockResolvedValue({ data: data_tmp })
    //       const result = await getGoogleOauthTokens({ code: '123' })
    //       console.log(result)
    //       expect(result).toEqual(data_tmp)
    //     })
    //   })
  })

  describe('getGoogleUser', () => {
    //   describe('given the wrong token data', () => {
    //     it('should return a bad request 400', async () => {
    //       axios.get = jest.fn().mockRejectedValueOnce({
    //         error: 'Bad Request',
    //         statusCode: 400
    //       })
    //       try {
    //         await getGoogleUser({ id_token: 'id_token', access_token: 'access_token' })
    //       } catch (err: any) {
    //         expect(err.statusCode).toBe(400)
    //       }
    //     })
    //   })
  })
})
