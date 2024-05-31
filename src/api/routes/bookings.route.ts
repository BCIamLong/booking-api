import { Router } from 'express'
import cors from 'cors'
import { asyncCatch } from '../utils'
import { bookingsController } from '../controllers'
import { validator, bookingSchema } from '../validators'
import { authMiddleware, bookingMiddleware } from '../middlewares'

const { createBookingSchema, updateBookingSchema, checkoutBookingSchema } = bookingSchema
const {
  getBookings,
  getBooking,
  updateBooking,
  postBooking,
  deleteBooking,
  getCheckOutSession,
  createBookingCheckout,
  getUserBookings,
  getUserBooking,
  deleteUserBooking
} = bookingsController
const { authenticate, authorize, auth2FA } = authMiddleware
const { bookingsQueryModifier } = bookingMiddleware

const bookingRouter = Router({ mergeParams: true })

/**
 * @openapi
 * '/api/v1/bookings/{id}/me':
 *  delete:
 *   tags:
 *   - Booking
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: delete a booking of the current user with the booking id
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
bookingRouter.delete('/:id/me', authenticate, auth2FA, authorize('user'), asyncCatch(deleteUserBooking))

/**
 * @openapi
 * '/api/v1/bookings/me':
 *  get:
 *   tags:
 *   - Booking
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: get all bookings of the current user
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
bookingRouter.get('/me', authenticate, auth2FA, authorize('user'), asyncCatch(getUserBookings))

/**
 * @openapi
 * '/api/v1/bookings/me/latest':
 *  get:
 *   tags:
 *   - Booking
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: get the latest booking of the current user
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
bookingRouter.get(
  '/me/latest',
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://bookings-app-client.vercel.app' : '*',
    credentials: true
  }),
  authenticate,
  auth2FA,
  authorize('user'),
  asyncCatch(getUserBooking)
)

/**
 * @openapi
 * '/api/v1/bookings/checkout-session':
 *  post:
 *   tags:
 *   - Booking
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: create checkout session
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/CheckoutSessionInput'
 *   responses:
 *    201:
 *     description: Success create checkout session
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         redirectUrl:
 *          type: string
 *
 *    400:
 *     description: Bad request
 *    500:
 *     description: Something went wrong
 */
bookingRouter.post(
  '/checkout-session',
  authenticate,
  auth2FA,
  authorize('user'),
  validator(checkoutBookingSchema),
  asyncCatch(getCheckOutSession)
)

/**
 * @openapi
 * '/api/v1/bookings/create-booking-checkout':
 *  get:
 *   tags:
 *   - Booking
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: create checkout booking with query string
 *   parameters:
 *    - name: user
 *      in: query
 *      schema:
 *       type: string
 *      description: the current user id
 *      required: true
 *    - name: cabin
 *      in: query
 *      schema:
 *       type: string
 *      description: the cabin id we check out
 *      required: true
 *    - name: price
 *      in: query
 *      schema:
 *       type: integer
 *      description: the price of the cabin
 *      required: true
 *    - name: endDate
 *      in: query
 *      schema:
 *       type: string
 *       format: date
 *      description: the end date of the cabin booking
 *      required: true
 *    - name: startDate
 *      in: query
 *      schema:
 *       type: string
 *       format: date
 *      description: the start date of the cabin booking
 *      required: true
 *    - name: numGuests
 *      in: query
 *      schema:
 *       type: integer
 *      description: the number of guests
 *      required: true
 *    - name: numNights
 *      in: query
 *      schema:
 *       type: integer
 *      description: the number of nights
 *      required: true
 *   responses:
 *    200:
 *     description: Success
 *    404:
 *     description: Not found
 *    500:
 *     description: Something went wrong
 */
bookingRouter.get(
  '/create-booking-checkout',
  authenticate,
  auth2FA,
  authorize('user'),
  asyncCatch(createBookingCheckout)
)

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
   * @openapi
   * '/api/v1/cabins/{cabinId}/bookings':
   *  get:
   *   tags:
   *   - Booking
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get all bookings of the cabin
   *   parameters:
   *    - name: cabinId
   *      in: path
   *      description: the id of the cabin
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
   *           bookings:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/BookingResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(authenticate, auth2FA, bookingsQueryModifier, asyncCatch(getBookings))
  // .get(authenticate, auth2FA, authorize('admin'), asyncCatch(getBookings))
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
  .post(authenticate, auth2FA, validator(createBookingSchema), asyncCatch(postBooking))

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
  .get(authenticate, auth2FA, asyncCatch(getBooking))
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
  .patch(authenticate, auth2FA, authorize('admin'), validator(updateBookingSchema), asyncCatch(updateBooking))
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
  .delete(authenticate, auth2FA, authorize('admin'), asyncCatch(deleteBooking))

export default bookingRouter
