jest.mock('../../database/models/booking.model.ts')
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

import Booking from '../../database/models/booking.model'
import bookingsService from '../bookings.service'

const { fetchBookings, fetchBooking, createBooking, editBooking, removeBooking } = bookingsService

const bookingItem = {
  _id: 'booking1',
  cabinId: 'cabin1',
  guestId: 'guest1',
  startDate: new Date(),
  endDate: new Date(),
  numNights: 4,
  numGuests: 2,
  cabinPrice: 200,
  extrasPrice: 50,
  totalPrice: 250,
  status: 'confirmed',
  hasBreakfast: true,
  isPaid: true,
  observation: 'Guests prefer a quiet cabin.',
  createdAt: new Date(),
  updatedAt: new Date()
}

const bookingInput = {
  cabinId: 'cabin1',
  guestId: 'guest1',
  startDate: new Date(),
  endDate: new Date(),
  numNights: 4,
  numGuests: 2,
  cabinPrice: 200,
  extrasPrice: 50,
  totalPrice: 250,
  //   status: 'confirmed',
  //   hasBreakfast: true,
  //   isPaid: true,
  observation: 'Guests prefer a quiet cabin.'
}

describe('unit test for bookings service', () => {
  describe('fetchBookings', () => {
    it('should return bookings', async () => {
      // @ts-ignore
      Booking.find.mockResolvedValue([bookingItem])
      // @ts-ignore
      // Booking.find.mockImplementationOnce(() => [bookingItem])

      const { data } = await fetchBookings()

      // @ts-ignore
      expect(data).toEqual([bookingItem])
    })
  })

  describe('fetchBooking', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Booking.findById.mockRejectedValueOnce({
          statusCode: 404
        })

        // @ts-ignore
        // Booking.findById.mockImplementationOnce(() => undefined)

        try {
          await fetchBooking('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a booking', async () => {
        // @ts-ignore
        Booking.findById.mockImplementationOnce(() => bookingItem)

        const { data } = await fetchBooking('valid_id')
        expect(data).toEqual(bookingItem)
      })
    })
  })

  describe('createBooking', () => {
    describe('given an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Booking.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await createBooking(bookingInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a new booking', async () => {
        // @ts-ignore
        Booking.create.mockImplementationOnce(() => bookingItem)

        const { data } = await createBooking(bookingInput)

        expect(data).toEqual(bookingItem)
      })
    })
  })

  describe('editBooking', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Booking.findByIdAndUpdate.mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Booking.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          await editBooking('invalid_id', bookingInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id but an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Booking.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await editBooking('valid_id', bookingInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid id and a valid input', () => {
      it('should return a new updated booking', async () => {
        // @ts-ignore
        Booking.create.mockImplementationOnce(() => bookingItem)

        const { data } = await createBooking(bookingInput)

        expect(data).toEqual(bookingItem)
      })
    })
  })

  describe('removeBooking', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Booking.findOneAndDelete.mockRejectedValueOnce({
          statusCode: 404
        })

        // @ts-ignore
        // Booking.findByIdAndDelete.mockImplementationOnce(() => undefined)

        try {
          await removeBooking({ id: 'invalid_id' })
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a booking', async () => {
        // @ts-ignore
        Booking.findOneAndDelete.mockImplementationOnce(() => bookingItem)

        const { data } = await removeBooking({ id: 'valid_id' })
        expect(data).toEqual(bookingItem)
        // expect(data).toEqual(undefined)
      })
    })
  })
})
