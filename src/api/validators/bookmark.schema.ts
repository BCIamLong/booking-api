import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateBookmarkInput:
 *    type: object
 *    required:
 *     - user
 *     - cabin
 *     - link
 *    properties:
 *     user:
 *      type: string
 *      default: user1
 *     cabin:
 *      type: string
 *      default: cabin4
 *     link:
 *      type: string
 *      default: http://localhost:5137/cabins/cabin4
 */
const createBookmarkSchema = Joi.object({
  user: Joi.string().uuid().required(),
  cabin: Joi.string().uuid().required(),
  link: Joi.string().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateBookmarkInput:
 *    type: object
 *    properties:
 *     link:
 *      type: string
 *      default: http://localhost:5137/cabins/cabin4
 */
const updateBookmarkSchema = Joi.object({
  link: Joi.string()
})

export default { createBookmarkSchema, updateBookmarkSchema }
