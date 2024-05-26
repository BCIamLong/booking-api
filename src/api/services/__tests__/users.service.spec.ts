jest.mock('bcrypt')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../utils/index.ts')
jest.mock('../../utils/APIFeatures.ts', () => {
  return jest.fn().mockImplementation(() => {
    return {
      filter: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      selectFields: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis()
    }
  })
})

import bcrypt from 'bcrypt'
import User from '../../database/models/user.model'
import usersService from '../users.service'

const { fetchUsers, fetchUser, createUser, editUser, removeUser } = usersService

const userItem = {
  _id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPwd(password123)',
  createdAt: new Date(),
  updatedAt: new Date()
}

const userInput = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
}

const updateUserInput = {
  name: 'John Doe',
  email: 'john@example.com'
}

describe('unit test for users service', () => {
  describe('fetchUsers', () => {
    it('should return users', async () => {
      // @ts-ignore
      User.find.mockResolvedValue([userItem])
      // User.find.mockImplementationOnce(() => [userItem])

      const { data } = await fetchUsers()

      // @ts-ignore
      expect(data).toEqual([userItem])
    })
  })

  describe('fetchUser', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        User.findById.mockRejectedValueOnce({
          statusCode: 404
        })
        // User.findById.mockImplementationOnce(() => undefined)

        try {
          await fetchUser('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a user', async () => {
        // @ts-ignore
        User.findById.mockImplementationOnce(() => userItem)

        const { data } = await fetchUser('valid_id')
        expect(data).toEqual(userItem)
      })
    })
  })

  describe('createUser', () => {
    describe('given an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await createUser(userInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the email is already exist', () => {
      it('should return an error with 409 status code', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })

        try {
          // @ts-ignore
          await createUser(userInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a new user', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        // @ts-ignore
        User.create.mockImplementationOnce(() => userItem)

        // @ts-ignore
        const { data } = await createUser(userInput)

        expect(data).toEqual(userItem)
      })
    })
  })

  describe('editUser', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        User.findByIdAndUpdate.mockRejectedValueOnce({
          statusCode: 404
        })
        // User.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          await editUser('invalid_id', updateUserInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id but an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        User.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await editUser('valid_id', updateUserInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid id and a valid input', () => {
      it('should return a new updated user', async () => {
        // @ts-ignore
        User.findByIdAndUpdate.mockImplementationOnce(() => userItem)

        const { data } = await editUser('valid_id', updateUserInput)

        expect(data).toEqual(userItem)
      })
    })
  })

  describe('removeUser', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        User.findOneAndDelete.mockRejectedValueOnce({
          statusCode: 404
        })
        // User.findByIdAndDelete.mockImplementationOnce(() => undefined)

        try {
          await removeUser({ id: 'invalid_id' })
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a user', async () => {
        // @ts-ignore
        User.findOneAndDelete.mockImplementationOnce(() => userItem)

        const { data } = await removeUser({ id: 'valid_id' })
        expect(data).toEqual(userItem)
      })
    })
  })
})
