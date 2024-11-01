import { Router } from 'express'
import toursController from '../controllers/tours.controller'
import { asyncCatch } from '../utils'
import bookingRouter from './bookings.route'
import { authMiddleware } from '../middlewares'

const { deleteTour, getTour, getTours, updateTour, postTour, getToursAvailableToPost } = toursController
const { authenticate, auth2FA, authorize } = authMiddleware

const toursRouter = Router({ mergeParams: true })

toursRouter.use('/:tourId/bookings', bookingRouter)

toursRouter.get('/tours-to-post', authenticate, auth2FA, asyncCatch(getToursAvailableToPost))

toursRouter.route('/').get(asyncCatch(getTours)).post(authenticate, auth2FA, authorize('admin'), asyncCatch(postTour))

toursRouter
  .route('/:id')
  .get(asyncCatch(getTour))
  .patch(authenticate, auth2FA, authorize('admin'), asyncCatch(updateTour))
  .delete(authenticate, auth2FA, authorize('admin'), asyncCatch(deleteTour))

export default toursRouter
