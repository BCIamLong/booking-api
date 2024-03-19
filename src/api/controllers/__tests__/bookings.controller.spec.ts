jest.mock('../../database/models/booking.model.ts')
import Booking from '../../database/models/booking.model'
import bookingsController from '../bookings.controller'

const { getBookings, getBooking, postBooking, deleteBooking, updateBooking } = bookingsController

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

describe('unit test for bookings controller', () => {
  describe('test getBookings function', () => {
    it('should return a status of 200 and bookings list', async () => {
      // @ts-ignore
      Booking.find.mockImplementationOnce(() => [bookingItem])

      // @ts-ignore
      await getBookings(req, res)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Object)
      })
    })
  })

  describe('test getBooking function', () => {
    describe('given an invalid booking id ', () => {
      it('should return a status of 404', async () => {
        // @ts-ignore
        Booking.findById.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await getBooking(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given an valid booking id ', () => {
      it('should return a status of 200 and booking', async () => {
        // @ts-ignore
        Booking.findById.mockImplementationOnce(() => bookingItem)

        // @ts-ignore
        await getBooking(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            booking: bookingItem
          }
        })
      })
    })
  })

  describe('test updateBooking function', () => {
    describe('given the invalid booking id', () => {
      it('should return a status of 404', async () => {
        // @ts-ignore
        Booking.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await updateBooking(req, res)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
          expect(res.json).toHaveBeenCalledTimes(0)
        }
      })
    })

    describe('given the invalid input', () => {
      it('should return a status of 400', async () => {
        // @ts-ignore
        Booking.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await updateBooking(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a status of 200 and new updated booking', async () => {
        // @ts-ignore
        Booking.findByIdAndUpdate.mockImplementationOnce(() => bookingItem)
        // @ts-ignore
        await updateBooking(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            booking: bookingItem
          }
        })
      })
    })
  })

  describe('test postBooking function', () => {
    describe('given an invalid input', () => {
      it('should return a status of 400', async () => {
        // @ts-ignore
        Booking.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await postBooking(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a status of 201 and new booking', async () => {
        // @ts-ignore
        Booking.create.mockImplementationOnce(() => bookingItem)
        // @ts-ignore
        await postBooking(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            // booking: expect.any(Object)
            booking: bookingItem
          }
        })
      })
    })
  })

  describe('test deleteBooking function', () => {
    describe('given an invalid id', () => {
      it('should return a status of 404', async () => {
        // @ts-ignore
        Booking.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          // @ts-ignore
          await deleteBooking(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a status of 204', async () => {
        // @ts-ignore
        Booking.findByIdAndDelete.mockImplementationOnce(() => bookingItem)
        // @ts-ignore
        await deleteBooking(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null })
      })
    })
  })
})
