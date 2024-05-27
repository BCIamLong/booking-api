jest.mock('bcrypt')
jest.mock('../../database/models/guest.model.ts')
jest.mock('../../services/auth.service')
jest.mock('../../utils/index.ts')
jest.mock('../../services/guests.service')
// jest.mock('~/api/services')
// import { authService } from '~/api/services'
import bcrypt from 'bcrypt'
import authService from '../../services/auth.service'
import guestService from '../../services/guests.service'
import Guest from '../../database/models/guest.model'
import guestsController from '../guests.controller'

const { getGuests, getGuest, postGuest, deleteGuest, updateGuest } = guestsController

const req = {
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
  json: jest.fn((x) => x)
}
// const res = jest

const guestItem = {
  _id: 'f10e695b-14df-4fe0-a944-fcf8e473e614',
  fullName: 'Alice Johnson',
  email: 'alice.johnson@example.com',
  password: 'hashedPwd(password123)',
  nationalId: '456789123',
  nationality: 'UK',
  countryFlag: '🇬🇧',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('unit test for guests controller', () => {
  describe('test getGuests function', () => {
    it('should return a status of 200 and guests list', async () => {
      // @ts-ignore
      jest.spyOn(guestService, 'fetchGuests').mockImplementationOnce(() => ({
        data: [guestItem],
        collectionName: 'guests',
        count: 1
      }))

      // @ts-ignore
      await getGuests(req, res)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Object),
        count: 1,
        results: 1
      })
    })
  })

  describe('test getGuest function', () => {
    describe('given an invalid guest id ', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(guestService, 'fetchGuest').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Guest.findById.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await getGuest(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given an valid guest id ', () => {
      it('should return a status of 200 and guest', async () => {
        // @ts-ignore
        jest.spyOn(guestService, 'fetchGuest').mockImplementationOnce(() => ({
          data: guestItem,
          collectionName: 'guests'
        }))
        // @ts-ignore
        // Guest.findById.mockImplementationOnce(() => guestItem)

        // @ts-ignore
        await getGuest(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            guest: guestItem
          }
        })
      })
    })
  })

  describe('test updateGuest function', () => {
    describe('given the invalid guest id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(guestService, 'editGuest').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Guest.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await updateGuest(req, res)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
          expect(res.json).toHaveBeenCalledTimes(0)
        }
      })
    })

    describe('given the invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(guestService, 'editGuest').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // @ts-ignore
        // Guest.findByIdAndUpdate.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await updateGuest(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a status of 200 and new updated guest', async () => {
        // @ts-ignore
        jest.spyOn(guestService, 'editGuest').mockImplementationOnce(() => ({
          data: guestItem,
          collectionName: 'guests'
        }))
        // @ts-ignore
        // Guest.findByIdAndUpdate.mockImplementationOnce(() => guestItem)

        // @ts-ignore
        await updateGuest(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            guest: guestItem
          }
        })
      })
    })
  })

  describe('test postGuest function', () => {
    describe('given an invalid input', () => {
      it('should return a status of 400', async () => {
        // @ts-ignore
        jest.spyOn(authService, 'checkEmailExist').mockImplementationOnce(() => true)

        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        jest.spyOn(guestService, 'createGuest').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // @ts-ignore
        // Guest.create.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await postGuest(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the email is already exist in guests', () => {
      it('should return an error with 409 status code', async () => {
        // @ts-ignore
        jest.spyOn(authService, 'checkEmailExist').mockImplementationOnce(() => true)

        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        jest.spyOn(guestService, 'createGuest').mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })
        // @ts-ignore
        // Guest.create.mockRejectedValueOnce({
        //   name: 'ConflictError',
        //   statusCode: 409
        // })

        try {
          // @ts-ignore
          await postGuest(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given the email is already exist in admins', () => {
      it('should return an error with 409 status code', async () => {
        // @ts-ignore
        jest.spyOn(authService, 'checkEmailExist').mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })

        // @ts-ignore
        // bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        // @ts-ignore
        // Guest.create.mockRejectedValueOnce({
        //   name: 'ConflictError',
        //   statusCode: 409
        // })

        try {
          // @ts-ignore
          await postGuest(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a status of 201 and new guest', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        // @ts-ignore
        jest.spyOn(guestService, 'createGuest').mockImplementationOnce(() => ({
          data: guestItem,
          collectionName: 'guests'
        }))
        // @ts-ignore
        // Guest.create.mockImplementationOnce(() => guestItem)

        // @ts-ignore
        await postGuest(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            // guest: expect.any(Object)
            guest: guestItem
          }
        })
      })
    })
  })

  describe('test deleteGuest function', () => {
    describe('given an invalid id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(guestService, 'removeGuest').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Guest.findByIdAndDelete.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await deleteGuest(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a status of 204', async () => {
        // @ts-ignore
        jest.spyOn(guestService, 'removeGuest').mockImplementationOnce(() => ({
          data: guestItem,
          collectionName: 'guests'
        }))
        // @ts-ignore
        // Guest.findByIdAndDelete.mockImplementationOnce(() => guestItem)
        // @ts-ignore
        await deleteGuest(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null })
      })
    })
  })
})
