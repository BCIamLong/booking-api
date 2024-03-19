import { bookingsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchBookings, fetchBooking, editBooking, createBooking, removeBooking } = bookingsService

const getBookings = getAll(async () => {
  const { data, collectionName } = await fetchBookings()
  return { data, collectionName }
})

const getBooking = getOne(async (options) => {
  const { data, collectionName } = await fetchBooking(options.id || '')
  return { data, collectionName }
})

const postBooking = postOne(async (options) => {
  const { data, collectionName } = await createBooking(options.body || {})

  return { data, collectionName }
})

const updateBooking = updateOne(async (options) => {
  const { data, collectionName } = await editBooking(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteBooking = deleteOne(async (options) => {
  const { data, collectionName } = await removeBooking(options.id || '')

  return { data, collectionName }
})

export default { getBookings, getBooking, postBooking, updateBooking, deleteBooking }
