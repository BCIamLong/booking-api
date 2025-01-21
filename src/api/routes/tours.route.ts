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
  /**
   * @openapi
   * '/api/v1/tours':
   *  get:
   *   tags:
   *   - Tour
   *   summary: get all tours
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         count:
   *          type: number
   *         results:
   *          type: number
   *         data:
   *          type: object
   *          properties:
   *           tours:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/TourResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .route('/')
  .get(asyncCatch(getTours))
  /**
   * @openapi
   * '/api/v1/tours':
   *  post:
   *   tags:
   *   - Tour
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create tour
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateTourInput'
   *   responses:
   *    201:
   *     description: Success create new data
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           tour:
   *            $ref: '#/components/schemas/TourResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   */
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
  /**
   * @openapi
   * '/api/v1/tours/{id}':
   *  get:
   *   tags:
   *   - Tour
   *   summary: get a tour with tour id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the tour
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           tour:
   *            $ref: '#/components/schemas/TourResponse'
   *    404:
   *     description: No tour found
   *    500:
   *     description: Something went wrong
   */
  .route('/:id')
  .get(asyncCatch(getTour))
  /**
   * @openapi
   * '/api/v1/tours':
   *  patch:
   *   tags:
   *   - Tour
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: Update tour
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateTourInput'
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           tour:
   *            $ref: '#/components/schemas/TourResponse'
   *
   *    400:
   *     description: Bad request
   *    404:
   *     description: No tour found
   *    500:
   *     description: Something went wrong
   */
  .patch(
    authenticate,
    auth2FA,
    //  authorize('admin'),
    // ! WHEN WE USE multipart/form-data TO SEND THE FORM DATA WE NEED TO SET UP A LIBRARY LIKE MULTER TO TAKE THE DATA TO THE req.body
    // * so basically it's not depend on we use file data or not it's because we use multipart/form-data so we need something to resolve our data and pass it to req.body or req.file and req.files...
    // upload.none(),
    upload.fields([
      { name: 'imageCover', maxCount: 1 },
      { name: 'images', maxCount: 3 }
    ]),
    resizeAndUploadTourImagesToCloud,
    covertJSONStringifyDataToOb,
    asyncCatch(updateTour)
  )
  /**
   * @openapi
   * '/api/v1/tours/{id}':
   *  delete:
   *   tags:
   *   - Tour
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a tour with the tour id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the tour
   *     required: true
   *   responses:
   *    204:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: null
   *    404:
   *     description: No tour found
   *    500:
   *     description: Something went wrong
   */
  .delete(
    authenticate,
    auth2FA,
    // authorize('admin'),
    asyncCatch(deleteTour)
  )

export default toursRouter
