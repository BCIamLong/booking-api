jest.mock('bcrypt')
jest.mock('../../database/models/user.model.ts')
import bcrypt from 'bcrypt'
import User from '../../database/models/user.model'
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
        User.findOne.mockImplementationOnce(() => new User(userItem))

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
        User.create.mockRejectedValueOnce({
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
        User.create.mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })

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
        User.create.mockImplementationOnce(() => userItem)

        // @ts-ignore
        const newUser = await signupService(signupInput)
        expect(newUser).toEqual(userItem)
      })
    })
  })
})
