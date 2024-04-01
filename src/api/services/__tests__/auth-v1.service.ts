jest.mock('../auth.service')
jest.mock('../../database/models/user.model.ts')
jest.mock('../../database/models/guest.model.ts')

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
  // beforeAll(() => {
  //   mongoose.Schema.prototype.methods = {
  //     // @ts-ignore
  //     checkPwd: jest.fn()
  //   }
  // })
  describe('loginService', () => {
    describe('given a false format email', () => {
      it('should return an error with status code of 400', async () => {
        // @ts-ignore
        const userQuery = {
          cache: jest.fn().mockRejectedValueOnce({
            name: 'ValidationError',
            statusCode: 400
          })
        }

        // @ts-ignore
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
  })
})
