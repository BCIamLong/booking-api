import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   LoginInput:
 *    type: object
 *    required:
 *     - email
 *     - password
 *    properties:
 *     email:
 *      type: string
 *      default: john@example.com
 *     password:
 *      type: string
 *      default: password123
 */
const loginSchema = Joi.object({
  // * for both guest and user(admin)
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   SignupInput:
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
 *      default: john@example.com
 *     password:
 *      type: string
 *      default: password123
 *     passwordConfirm:
 *      type: string
 *      default: password123
 */
const signupSchema = Joi.object({
  // * for only guest
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref('password')
})

/**
 * @openapi
 * components:
 *  schemas:
 *   ForgotPasswordInput:
 *    type: object
 *    required:
 *     - email
 *    properties:
 *     email:
 *      type: string
 *      default: john@example.com
 *   ForgotPasswordResponse:
 *    type: object
 *    properties:
 *     status:
 *      type: string
 *     message:
 *      type: string
 */
const forgotPwdSchema = Joi.object({
  email: Joi.string().email().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   ResetPasswordInput:
 *    type: object
 *    required:
 *     - password
 *     - passwordConfirm
 *    properties:
 *     password:
 *      type: string
 *      default: password123
 *     passwordConfirm:
 *      type: string
 *      default: password123
 *   ResetPasswordResponse:
 *    type: object
 *    properties:
 *     status:
 *      type: string
 *     token:
 *      type: string
 */
const resetPwdSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref('password')
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateCurrentUserInput:
 *    type: object
 *    properties:
 *     fullName:
 *      type: string
 *     email:
 *      type: string
 *     avatar:
 *      type: string
 *      format: binary
 *   UpdateCurrentUserResponse:
 *    type: object
 *    properties:
 *     status:
 *      type: string
 *     data:
 *      type: object
 *      properties:
 *       user:
 *        oneOf:
 *         - $ref: '#components/schemas/GuestResponse'
 *         - $ref: '#components/schemas/UserResponse'
 */
// * https://swagger.io/docs/specification/data-models/oneof-anyof-allof-not/#oneof
const updateCurrentUserSchema = Joi.object({
  name: Joi.string(),
  fullName: Joi.string(),
  email: Joi.string().email(),
  avatar: Joi.object({
    originalname: Joi.string().required(),
    size: Joi.number().required(),
    mimetype: Joi.string()
      .pattern(/^image/)
      .required()
  })
})

/**
 * @openapi
 * components:
 *  schemas:
 *   CheckCurrentPasswordInput:
 *    type: object
 *    required:
 *     - password
 *    properties:
 *     password:
 *      type: string
 *      default: password123
 *   CheckCurrentPasswordResponse:
 *    type: object
 *    properties:
 *     status:
 *      type: string
 *     token:
 *      type: string
 */
const checkCurrentPasswordSchema = Joi.object({
  password: Joi.string().min(8).required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdatePasswordInput:
 *    type: object
 *    required:
 *     - password
 *     - passwordConfirm
 *    properties:
 *     password:
 *      type: string
 *      default: password1234
 *     passwordConfirm:
 *      type: string
 *      default: password1234
 *   UpdatePasswordResponse:
 *    type: object
 *    properties:
 *     status:
 *      type: string
 *     token:
 *      type: string
 */
const updatePasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref('password')
})

/**
 * @openapi
 * components:
 *  schemas:
 *   DeleteCurrentUserInput:
 *    type: object
 *    required:
 *     - reason
 *     - password
 *    properties:
 *     reason:
 *      type: string
 *      default: Bad user experience
 *     password:
 *      type: string
 *      default: password1234
 *   DeleteCurrentUserResponse:
 *    type: object
 *    properties:
 *     status:
 *      type: string
 *     message:
 *      type: string
 */
const deleteCurrentUserSchema = Joi.object({
  reason: Joi.string().required(),
  password: Joi.string().min(8).required()
})

export default {
  loginSchema,
  signupSchema,
  forgotPwdSchema,
  resetPwdSchema,
  updateCurrentUserSchema,
  checkCurrentPasswordSchema,
  updatePasswordSchema,
  deleteCurrentUserSchema
}
