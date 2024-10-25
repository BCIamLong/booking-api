import { Post, Tour } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { ITour } from '../interfaces'
import { ITourInput } from '../interfaces/ITour'
import bookingsService from './bookings.service'

const { fetchBookings } = bookingsService
// import { AppError } from '../utils'

const fetchTours = fetchAll<ITour>(Tour)
const fetchTour = fetchOne<ITour>(Tour)
const createTour = createOne<ITour, ITourInput>(Tour)
const editTour = editOne<ITour>(Tour)
const removeTour = removeOne<ITour>(Tour)

const getToursAvailableToPostService = async function ({ userId }: { userId: string }) {
  const { data: bookings } = await fetchBookings({ guestId: userId })
  // * 1 get the bookings from the user
  // * 2 get the tour id from booking to tour id array
  // * 3 we need to check if the tour is already created in post

  const postQueryObs = bookings.map((b) => Post.findOne({ userId, tourId: b.cabinId }))
  const posts = await Promise.all(postQueryObs)

  const tourQueryObs = posts.filter((p) => p).map((p) => p?.tourId)
  const tours = await Promise.all(tourQueryObs)

  return tours
}

export default { fetchTour, fetchTours, createTour, editTour, removeTour, getToursAvailableToPostService }
