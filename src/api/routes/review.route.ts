import { Router } from 'express'
import { reviewController } from '../controllers'
import { asyncCatch } from '../utils'
import { authMiddleware, reviewMiddleware } from '../middlewares'
import { reviewSchema, validator } from '../validators'

const reviewRouter = Router({ mergeParams: true })

const { reviewsQueryModifier, reviewQueryModifier } = reviewMiddleware
const { auth2FA, authorize, authenticate } = authMiddleware
const { getReviews, getReview, postReview, updateReview, deleteReview } = reviewController
const { createReviewSchema, updateReviewSchema } = reviewSchema

reviewRouter.use(authenticate, auth2FA)

reviewRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/reviews':
   *  get:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get all reviews
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
   *           settings:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/ReviewResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   * @openapi
   * '/api/v1/cabins/:cabinId/reviews':
   *  get:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get all reviews
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
   *           settings:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/ReviewResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(reviewsQueryModifier, asyncCatch(getReviews))
  /**
   * @openapi
   * '/api/v1/reviews':
   *  post:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create review
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateReviewInput'
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
   *           setting:
   *            $ref: '#/components/schemas/ReviewResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(authorize('user'), reviewsQueryModifier, validator(createReviewSchema), asyncCatch(postReview))

reviewRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/reviews/{id}':
   *  get:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get a review with review id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the review
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/ReviewResponse'
   *    404:
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   * @openapi
   * '/api/v1/cabins/{cabinId}/reviews/{id}':
   *  get:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get a review of the cabin with review id
   *   parameters:
   *    - name: cabinId
   *      in: path
   *      description: the id of the cabin
   *      required: true
   *    - name: id
   *      in: path
   *      description: the id of the review
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/ReviewResponse'
   *    404:
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   */
  .get(reviewQueryModifier, asyncCatch(getReview))
  /**
   * @openapi
   * '/api/v1/reviews/{id}':
   *  patch:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: update a review with the review id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the review
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateReviewInput'
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
   *           setting:
   *            $ref: '#components/schemas/ReviewResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   */
  .patch(validator(updateReviewSchema), asyncCatch(updateReview))
  /**
   * @openapi
   * '/api/v1/reviews/{id}':
   *  delete:
   *   tags:
   *   - Review
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a setting with the setting id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the setting
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
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   */
  .delete(asyncCatch(deleteReview))

export default reviewRouter
