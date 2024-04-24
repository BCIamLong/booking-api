import { Booking } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { IBooking } from '../interfaces'
import { IBookingInput } from '../interfaces/IBooking'
import { AppError } from '../utils'
// import { AppError } from '../utils'

const fetchBookings = fetchAll<IBooking>(Booking)
const fetchBooking = fetchOne<IBooking>(Booking)
const createBooking = createOne<IBooking, IBookingInput>(Booking)
const editBooking = editOne<IBooking>(Booking)
const removeBooking = removeOne<IBooking>(Booking)

const removeUserBooking = async function ({ bookingId, guestId }: { bookingId: string; guestId: string }) {
  const booking = await Booking.findOneAndDelete({ _id: bookingId, guestId })
  if (!booking) throw new AppError(404, 'No booking found')

  return booking
}

export default { fetchBooking, fetchBookings, createBooking, editBooking, removeBooking, removeUserBooking }
