import { Router } from 'express'
import { cabinsController } from '../controllers'
import { asyncCatch } from '../utils'
import { validator, cabinSchema } from '../validators'
import { authMiddleware } from '../middlewares'

const { createCabinSchema, updateCabinSchema } = cabinSchema
const { getCabins, getCabin, postCabin, updateCabin, deleteCabin } = cabinsController
const { authenticate, authorize } = authMiddleware

const cabinsRouter = Router()

cabinsRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/cabins':
   *  get:
   *   tags:
   *   - Cabin
   *   summary: get all cabins
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
   *           cabins:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/CabinResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getCabins))
  /**
   * @openapi
   * '/api/v1/cabins':
   *  post:
   *   tags:
   *   - Cabin
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create cabin
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateCabinInput'
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
   *           cabin:
   *            $ref: '#/components/schemas/CabinResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(authenticate, authorize('admin'), validator(createCabinSchema), asyncCatch(postCabin))

cabinsRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/cabins/{id}':
   *  get:
   *   tags:
   *   - Cabin
   *   summary: get a cabin with cabin id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the cabin
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/CabinResponse'
   *    404:
   *     description: Cabin not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getCabin))
  /**
   * @openapi
   * '/api/v1/cabins/{id}':
   *  patch:
   *   tags:
   *   - Cabin
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: update an cabin with the cabin id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the cabin
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateCabinInput'
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
   *           cabin:
   *            $ref: '#components/schemas/CabinResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No cabin found
   *    500:
   *     description: Something went wrong
   */
  .patch(authenticate, authorize('admin'), validator(updateCabinSchema), asyncCatch(updateCabin))
  /**
   * @openapi
   * '/api/v1/cabins/{id}':
   *  delete:
   *   tags:
   *   - Cabin
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a cabin with the cabin id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the cabin
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
   *     description: No cabin found
   *    500:
   *     description: Something went wrong
   */
  .delete(authenticate, authorize('admin'), asyncCatch(deleteCabin))

export default cabinsRouter
