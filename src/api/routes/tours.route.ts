import { Router } from 'express'
import toursController from '../controllers/tours.controller'
import { asyncCatch } from '../utils'
import bookingRouter from './bookings.route'
import { authMiddleware, uploadMiddleware, tourMiddleware } from '../middlewares'
import reviewRouter from './review.route'
import bookmarksRouter from './bookmarks.route'
import { uploadConfig } from '~/config'

const { deleteTour, getTour, getTours, updateTour, postTour, getToursAvailableToPost } = toursController
const { authenticate, auth2FA, authorize } = authMiddleware
const { upload } = uploadConfig
const { resizeAndUploadTourImagesToCloud } = uploadMiddleware
const { covertJSONStringifyDataToOb } = tourMiddleware

const toursRouter = Router({ mergeParams: true })
// * it should tour id but in this case let assume cabin Id is like item Id of bookings, reviews and bookmarks
toursRouter.use('/:cabinId/bookings', bookingRouter)
toursRouter.use('/:cabinId/reviews', reviewRouter)
toursRouter.use('/:cabinId/bookmarks', bookmarksRouter)

toursRouter.get('/tours-to-post', authenticate, auth2FA, asyncCatch(getToursAvailableToPost))

toursRouter
  .route('/')
  .get(asyncCatch(getTours))
  .post(
    authenticate,
    auth2FA,
    // authorize('admin'),
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 3 }
    ]),
    resizeAndUploadTourImagesToCloud,
    covertJSONStringifyDataToOb,
    asyncCatch(postTour)
  )

toursRouter
  .route('/:id')
  .get(asyncCatch(getTour))
  .patch(authenticate, auth2FA, authorize('admin'), asyncCatch(updateTour))
  .delete(authenticate, auth2FA, authorize('admin'), asyncCatch(deleteTour))

export default toursRouter
