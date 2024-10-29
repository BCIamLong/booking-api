import { Router } from 'express'
import toursController from '../controllers/tours.controller'
import { asyncCatch } from '../utils'
import bookingRouter from './bookings.route'

const { deleteTour, getTour, getTours, updateTour, postTour, getToursAvailableToPost } = toursController

const toursRouter = Router({ mergeParams: true })

toursRouter.get('/tours-to-post', asyncCatch(getToursAvailableToPost))

toursRouter.use('/:tourId/bookings', bookingRouter)

toursRouter.route('/').get(asyncCatch(getTours)).post(asyncCatch(postTour))

toursRouter.route('/:id').get(asyncCatch(getTour)).patch(asyncCatch(updateTour)).delete(asyncCatch(deleteTour))

export default toursRouter
