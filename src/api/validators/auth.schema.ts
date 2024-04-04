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
  passwordConfirm: Joi.string().min(8).required()
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

export default { loginSchema, signupSchema, forgotPwdSchema, resetPwdSchema }
