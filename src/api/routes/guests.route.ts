import { Router } from 'express'
import { guestsController } from '../controllers'
import { asyncCatch } from '../utils'

const { getGuests, postGuest, getGuest, updateGuest, deleteGuest } = guestsController

const guestRouter = Router()

guestRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/guests':
   *  get:
   *   tags:
   *   - Guest
   *   summary: get all guests
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
   *           guests:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/GuestResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getGuests))
  /**
   * @openapi
   * '/api/v1/guests':
   *  post:
   *   tags:
   *   - Guest
   *   summary: create guest
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateGuestInput'
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
   *           guest:
   *            $ref: '#/components/schemas/GuestResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(asyncCatch(postGuest))

guestRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/guests/{id}':
   *  get:
   *   tags:
   *   - Guest
   *   summary: get a guest with guest id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the guest
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/GuestResponse'
   *    404:
   *     description: No guest found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getGuest))
  /**
   * @openapi
   * '/api/v1/guests/{id}':
   *  patch:
   *   tags:
   *   - Guest
   *   summary: update an guest with the guest id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the guest
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateGuestInput'
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
   *           guest:
   *            $ref: '#components/schemas/GuestResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No guest found
   *    500:
   *     description: Something went wrong
   */
  .patch(asyncCatch(updateGuest))
  /**
   * @openapi
   * '/api/v1/guests/{id}':
   *  delete:
   *   tags:
   *   - Guest
   *   summary: delete a guest with the guest id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the guest
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
   *     description: No guest found
   *    500:
   *     description: Something went wrong
   */
  .delete(asyncCatch(deleteGuest))

export default guestRouter
