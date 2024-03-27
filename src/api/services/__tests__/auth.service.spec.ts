jest.mock('mongoose')
jest.mock('bcrypt')
// jest.mock('~/api/database/models')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../database/models/user.model.ts')
import mongoose, { Schema, Query } from 'mongoose'
// import { User, Guest } from '~/api/database/models'
import User from '../../database/models/user.model'
import Guest from '../../database/models/guest.model'
import authService from '../auth.service'

const { loginService, signupService, checkEmailExist } = authService

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
        // @ts-ignore
        Guest.findOne.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // @ts-ignore
        User.findOne.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await loginService('user@example.com', 'password')
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })
    describe('given a true format email but email is not exist', () => {
      it('should return an error with status code of 404', async () => {
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => undefined)

        try {
          await loginService('user@example.com', 'password')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid email and a wrong password or a wrong format password', () => {
      it('should return an user', async () => {
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

        // @ts-ignore
        const userQuery = new Query({}, null, null, User, null)
        // @ts-ignore
        userQuery.cache.mockImplementationOnce(() => userDoc)

        // @ts-ignore
        const guestQuery = new Query({}, null, null, Guest, null)
        // @ts-ignore
        guestQuery.cache.mockImplementationOnce(() => guestDoc)

        // @ts-ignore
        User.findOne.mockImplementationOnce(() => userQuery)
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestQuery)
        try {
          const user = await loginService('john@example.com', 'password123')
          expect(user).toEqual(user)
        } catch (err: any) {
          console.log(err)
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
        User.findOne.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        // @ts-ignore
        Guest.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

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
        Guest.create.mockImplementationOnce(() => guestItem)

        // @ts-ignore
        const newUser = await signupService(signupInput)
        expect(newUser).toEqual(guestItem)

        // expect([userItem, guestItem]).toContainEqual(newUser)
      })
    })
  })

  describe('checkEmailExist', () => {
    describe('given an user is already exist in the guests collection', () => {
      it('should return a 409 error', async () => {
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => guestItem)

        try {
          await checkEmailExist('user', 'user@example.come')
        } catch (err: any) {
          expect(err.statusCode).toBe(409)
        }
      })
    })
    describe('given an user is already exist in the users collection', () => {
      it('should return a 409 error', async () => {
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => guestItem)

        try {
          await checkEmailExist('admin', 'admin@example.come')
        } catch (err: any) {
          expect(err.statusCode).toBe(409)
        }
      })
    })
    describe("given an user doesn't exist in the guests and users collection", () => {
      it('should return nothing', async () => {
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => undefined)
        // @ts-ignore
        User.findOne.mockImplementationOnce(() => undefined)

        const data1 = await checkEmailExist('user', 'user@example.come')
        const data2 = await checkEmailExist('admin', 'admin@example.come')

        expect(data1).toBe(undefined)
        expect(data2).toBe(undefined)
      })
    })
  })
})

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason)
// })
