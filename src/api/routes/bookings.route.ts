import { Router } from 'express'
import { asyncCatch } from '../utils'
import { bookingsController } from '../controllers'

const { getBookings, getBooking, updateBooking, postBooking, deleteBooking } = bookingsController

const bookingRouter = Router()

bookingRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/bookings':
   *  get:
   *   tags:
   *   - Booking
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
  .get(asyncCatch(getBookings))
  /**
   * @openapi
   * '/api/v1/bookings':
   *  post:
   *   tags:
   *   - Booking
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
  .post(asyncCatch(postBooking))

bookingRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/bookings/{id}':
   *  get:
   *   tags:
   *   - Booking
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
  .get(asyncCatch(getBooking))
  /**
   * @openapi
   * '/api/v1/bookings/{id}':
   *  patch:
   *   tags:
   *   - Booking
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
  .patch(asyncCatch(updateBooking))
  /**
   * @openapi
   * '/api/v1/bookings/{id}':
   *  delete:
   *   tags:
   *   - Booking
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
  .delete(asyncCatch(deleteBooking))

export default bookingRouter
