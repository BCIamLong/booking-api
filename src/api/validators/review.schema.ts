import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateReviewInput:
 *    type: object
 *    required:
 *     - review
 *     - rating
 *     - user
 *     - cabin
 *    properties:
 *     review:
 *      type: string
 *      default: It's good
 *     rating:
 *      type: number
 *      default: 4
 *     user:
 *      type: string
 *      default: guest-e0df48cb-823d-46b5-93d1-212f272aaf3e
 *     cabin:
 *      type: string
 *      default: cabin1
 */
const createReviewSchema = Joi.object({
  review: Joi.string().required(),
  rating: Joi.number().valid(1, 2, 3, 4, 5).required(),
  user: Joi.string().required(),
  cabin: Joi.string().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateReviewInput:
 *    type: object
 *    properties:
 *     review:
 *      type: string
 *      default: It's good
 *     rating:
 *      type: number
 *      default: 4
 */
const updateReviewSchema = Joi.object({
  review: Joi.string(),
  rating: Joi.number().valid(1, 2, 3, 4, 5)
})

export default { createReviewSchema, updateReviewSchema }
