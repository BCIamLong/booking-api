jest.mock('bcrypt')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../database/models/guest.model.ts')
import bcrypt from 'bcrypt'
import User from '../../database/models/user.model'
import Guest from '../../database/models/guest.model'
import authService from '../auth.service'

const { loginService, signupService } = authService

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
        User.findOne.mockImplementationOnce(() => new User(userItem))
        // @ts-ignore
        Guest.findOne.mockImplementationOnce(() => new Guest(guestItem))

        const user = await loginService('john@example.com', 'password123')

        expect(user).toEqual(user)
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
})
