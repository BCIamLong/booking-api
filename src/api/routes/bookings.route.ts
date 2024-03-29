import { Router } from 'express'
import { asyncCatch } from '../utils'
import { bookingsController } from '../controllers'
import { validator, bookingSchema } from '../validators'
import { authMiddleware } from '../middlewares'

const { createBookingSchema, updateBookingSchema } = bookingSchema
const { getBookings, getBooking, updateBooking, postBooking, deleteBooking } = bookingsController
const { authenticate, authorize } = authMiddleware

const bookingRouter = Router()

bookingRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/bookings':
   *  get:
   *   tags:
   *   - Booking
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get all bookings
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
   *           bookings:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/BookingResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(authenticate, authorize('admin'), asyncCatch(getBookings))
  /**
   * @openapi
   * '/api/v1/bookings':
   *  post:
   *   tags:
   *   - Booking
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create booking
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateBookingInput'
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
   *           booking:
   *            $ref: '#/components/schemas/BookingResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(authenticate, validator(createBookingSchema), asyncCatch(postBooking))

bookingRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/bookings/{id}':
   *  get:
   *   tags:
   *   - Booking
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get a booking with booking id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the booking
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/BookingResponse'
   *    404:
   *     description: Booking not found
   *    500:
   *     description: Something went wrong
   */
  .get(authenticate, asyncCatch(getBooking))
  /**
   * @openapi
   * '/api/v1/bookings/{id}':
   *  patch:
   *   tags:
   *   - Booking
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: update an booking with the booking id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the booking
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateBookingInput'
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
   *           booking:
   *            $ref: '#components/schemas/BookingResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No booking found
   *    500:
   *     description: Something went wrong
   */
  .patch(authenticate, authorize('admin'), validator(updateBookingSchema), asyncCatch(updateBooking))
  /**
   * @openapi
   * '/api/v1/bookings/{id}':
   *  delete:
   *   tags:
   *   - Booking
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a booking with the booking id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the booking
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
   *     description: No booking found
   *    500:
   *     description: Something went wrong
   */
  .delete(authenticate, authorize('admin'), asyncCatch(deleteBooking))

export default bookingRouter
