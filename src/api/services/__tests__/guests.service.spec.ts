jest.mock('bcrypt')
jest.mock('../../database/models/guest.model.ts')
import bcrypt from 'bcrypt'
import Guest from '../../database/models/guest.model'
import guestsService from '../guests.service'

const { fetchGuests, fetchGuest, createGuest, editGuest, removeGuest } = guestsService

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

const guestInput = {
  fullName: 'Alice Johnson',
  email: 'alice.johnson@example.com',
  nationalId: '456789123',
  password: 'password123',
  passwordConfirm: 'password123',
  nationality: 'UK',
  countryFlag: '🇬🇧'
}

describe('unit test for guests service', () => {
  describe('fetchGuests', () => {
    it('should return guests', async () => {
      // @ts-ignore
      Guest.find.mockImplementationOnce(() => [guestItem])

      const { data } = await fetchGuests()

      // @ts-ignore
      expect(data).toEqual([guestItem])
    })
  })

  describe('fetchGuest', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Guest.findById.mockImplementationOnce(() => undefined)
        try {
          await fetchGuest('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a guest', async () => {
        // @ts-ignore
        Guest.findById.mockImplementationOnce(() => guestItem)

        const { data } = await fetchGuest('valid_id')
        expect(data).toEqual(guestItem)
      })
    })
  })

  describe('createGuest', () => {
    describe('given an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => '123456789')

        // @ts-ignore
        Guest.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await createGuest(guestInput)
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
        Guest.create.mockRejectedValueOnce({
          name: 'ConflictError',
          statusCode: 409
        })

        try {
          // @ts-ignore
          await createGuest(guestInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(409)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a new guest', async () => {
        // @ts-ignore
        bcrypt.hash.mockImplementationOnce(() => 'hashedPwd(password123)')

        // @ts-ignore
        Guest.create.mockImplementationOnce(() => guestItem)

        const { data } = await createGuest(guestInput)

        expect(data).toEqual(guestItem)
      })
    })
  })

  describe('editGuest', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Guest.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          await editGuest('invalid_id', guestInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id but an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Guest.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await editGuest('valid_id', guestInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid id and a valid input', () => {
      it('should return a new updated guest', async () => {
        // @ts-ignore
        Guest.create.mockImplementationOnce(() => guestItem)

        const { data } = await createGuest(guestInput)

        expect(data).toEqual(guestItem)
      })
    })
  })

  describe('removeGuest', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Guest.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          await removeGuest('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a guest', async () => {
        // @ts-ignore
        Guest.findByIdAndDelete.mockImplementationOnce(() => guestItem)

        const { data } = await removeGuest('valid_id')
        expect(data).toEqual(guestItem)
        // expect(data).toEqual(undefined)
      })
    })
  })
})
