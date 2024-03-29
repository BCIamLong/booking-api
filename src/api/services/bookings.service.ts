import { Booking } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { IBooking } from '../interfaces'
// import { AppError } from '../utils'

const fetchBookings = fetchAll<IBooking>(Booking)
const fetchBooking = fetchOne<IBooking>(Booking)
const createBooking = createOne<IBooking>(Booking)
const editBooking = editOne<IBooking>(Booking)
const removeBooking = removeOne<IBooking>(Booking)

export default { fetchBooking, fetchBookings, createBooking, editBooking, removeBooking }
