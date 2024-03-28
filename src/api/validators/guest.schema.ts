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
 *     - password
 *     - passwordConfirm
 *    properties:
 *     fullName:
 *      type: string
 *      default: John Doe
 *     email:
 *      type: string
 *      default: john.doe@example.com
 *     password:
 *      type: string
 *      default: password123
 *     passwordConfirm:
 *      type: string
 *      default: password123
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
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required(),
  avatar: Joi.string(),
  nationalId: Joi.string(),
  nationality: Joi.string(),
  countryFlag: Joi.string()
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
 *     verifyEmail:
 *      type: boolean
 *      default: true
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
  verifyEmail: Joi.boolean(),
  avatar: Joi.string(),
  nationalId: Joi.string(),
  nationality: Joi.string(),
  countryFlag: Joi.string()
})

export default { createGuestSchema, updateGuestSchema }
