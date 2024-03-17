import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateCabinInput:
 *    type: object
 *    required:
 *     - name
 *     - maxCapacity
 *     - regularPrice
 *     - discount
 *     - description
 *     - image
 *    properties:
 *     name:
 *      type: string
 *      default: ozy Cabin
 *     maxCapacity:
 *      type: number
 *      default: 6
 *     regularPrice:
 *      type: number
 *      default: 160
 *     discount:
 *      type: number
 *      default: 30
 *     description:
 *      type: string
 *      default: A cozy cabin for a small group or family getaway.
 *     image:
 *      type: string
 *      default: cozy_cabin.jpg
 */
const createCabinSchema = Joi.object({
  name: Joi.string().required(),
  maxCapacity: Joi.number().min(0).max(100).required(),
  regularPrice: Joi.number().min(0).required(),
  discount: Joi.number().min(0).required(),
  description: Joi.string().required(),
  image: Joi.string().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateCabinInput:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      default: ozy Cabin
 *     maxCapacity:
 *      type: number
 *      default: 6
 *     regularPrice:
 *      type: number
 *      default: 160
 *     description:
 *      type: string
 *      default: A cozy cabin for a small group or family getaway.
 *     image:
 *      type: string
 *      default: cozy_cabin.jpg
 */
const updateCabinSchema = Joi.object({
  name: Joi.string(),
  maxCapacity: Joi.number().min(0).max(100),
  regularPrice: Joi.number().min(0),
  discount: Joi.number().min(0),
  description: Joi.string(),
  image: Joi.string()
})

export default { createCabinSchema, updateCabinSchema }
