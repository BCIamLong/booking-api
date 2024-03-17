import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateGuestInput:
 *    type: object
 *    required:
 *     - fullName
 *     - email
 *     - nationalId
 *     - nationality
 *     - countryFlag
 *    properties:
 *     fullName:
 *      type: string
 *      default: John Doe
 *     email:
 *      type: string
 *      default: john.doe@example.com
 *     nationalId:
 *      type: string
 *      default: 123456789
 *     nationality:
 *      type: string
 *      default: USA
 *     countryFlag:
 *      type: string
 *      default: 🇺🇸
 */
const createGuestSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  nationalId: Joi.string().required(),
  nationality: Joi.string().required(),
  countryFlag: Joi.string().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateGuestInput:
 *    type: object
 *    properties:
 *     fullName:
 *      type: string
 *      default: John Doe
 *     email:
 *      type: string
 *      default: john.doe@example.com
 *     nationalId:
 *      type: string
 *      default: 123456789
 *     nationality:
 *      type: string
 *      default: USA
 *     countryFlag:
 *      type: string
 *      default: 🇺🇸
 */
const updateGuestSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
  nationalId: Joi.string(),
  nationality: Joi.string(),
  countryFlag: Joi.string()
})

export default { createGuestSchema, updateGuestSchema }
