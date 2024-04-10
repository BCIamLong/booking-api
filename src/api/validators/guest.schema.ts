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
  passwordConfirm: Joi.ref('password'),
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
 *     deactivated:
 *      type: boolean
 *      default: false
 *     deactivatedReason:
 *      type: string
 *      default: Bad user experience
 */
const updateGuestSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  passwordConfirm: Joi.ref('password'),
  verifyEmail: Joi.boolean(),
  avatar: Joi.string(),
  nationalId: Joi.string(),
  nationality: Joi.string(),
  countryFlag: Joi.string(),
  deactivated: Joi.boolean(),
  deactivatedReason: Joi.string()
})
// * in some case admin or some one have permission can change the password of the guest if it's needed

export default { createGuestSchema, updateGuestSchema }
