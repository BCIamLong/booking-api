import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateSettingInput:
 *    type: object
 *    required:
 *     - minBookingLength
 *     - maxBookingLength
 *     - maxGuestsPersonal
 *     - breakfastPrice
 *    properties:
 *     minBookingLength:
 *      type: number
 *      default: 10
 *     maxBookingLength:
 *      type: number
 *      default: 12
 *     maxGuestsPersonal:
 *      type: number
 *      default: 15
 *     breakfastPrice:
 *      type: number
 *      default: 20
 */
const createSettingSchema = Joi.object({
  minBookingLength: Joi.number().required(),
  maxBookingLength: Joi.number().required(),
  maxGuestsPersonal: Joi.number().required(),
  breakfastPrice: Joi.number().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateSettingInput:
 *    type: object
 *    properties:
 *     minBookingLength:
 *      type: number
 *      default: 10
 *     maxBookingLength:
 *      type: number
 *      default: 12
 *     maxGuestsPersonal:
 *      type: number
 *      default: 15
 *     breakfastPrice:
 *      type: number
 *      default: 20
 */
const updateSettingSchema = Joi.object({
  minBookingLength: Joi.number(),
  maxBookingLength: Joi.number(),
  maxGuestsPersonal: Joi.number(),
  breakfastPrice: Joi.number()
})

export default { createSettingSchema, updateSettingSchema }
