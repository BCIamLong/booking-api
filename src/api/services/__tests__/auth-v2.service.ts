jest.mock('axios')
jest.mock('../auth.service')

import axios from 'axios'
import authService from '../auth.service'

const { loginService, signupService, checkEmailExist, getGoogleOauthTokens, getGoogleUser } = authService

describe('getGoogleOauthTokens', () => {
  describe('given the invalid code', () => {
    it('should return a bad request 400', async () => {
      // @ts-ignore
      axios.post = jest.fn().mockRejectedValueOnce(new Error('Bad Request'))

      expect(await getGoogleOauthTokens({ code: '123' })).rejects.toThrow('Bad Request')
    })
  })

  // describe('given the valid code', () => {
  //   it('should return a token data', async () => {
  //     const data_tmp = {
  //       id_token: 'id_token',
  //       access_token: 'access_token'
  //     }
  //     // @ts-ignore
  //     axios.post = jest.fn().mockResolvedValue({ data: data_tmp })

  //     const result = await getGoogleOauthTokens({ code: '123' })
  //     console.log(result)
  //     expect(result).toEqual(data_tmp)
  //   })
  // })
})
