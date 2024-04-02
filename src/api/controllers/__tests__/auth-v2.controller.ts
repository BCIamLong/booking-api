jest.mock('dotenv/config')
jest.mock('jsonwebtoken')

import 'dotenv/config'
import jwt from 'jsonwebtoken'
import authController from '../auth.controller'

const { login, signup, verifyEmail, loginWithGoogle } = authController

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

describe('given an invalid token', () => {
  it('should return a 500 invalid token', async () => {
    // @ts-ignore
    jwt.verify.mockRejectedValueOnce({
      type: 'InvalidToken',
      statusCode: 500
    })
    // @ts-ignore
    // redisClient.get.mockImplementationOnce(() => undefined)

    // @ts-ignore
    // jest.spyOn(guestsService, 'editGuest').mockRejectedValueOnce({
    //   type: 'InvalidToken',
    //   statusCode: 500
    // })

    const req1 = {
      ...req,
      headers: {
        authorization: 'Bearer invalid_bearer_token'
      },
      cookies: {
        'access-token': 'invalid_access_token',
        'refresh-token': 'invalid_refresh_token'
      }
    }
    try {
      // @ts-ignore
      expect(await verifyEmail(req1, res)).rejects.toThrow()
    } catch (err: any) {
      console.log(err)
      expect(err.statusCode).toBe(500)
    }
  })
})
