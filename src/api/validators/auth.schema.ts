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
 *     - name
 *     - email
 *     - password
 *     - passwordConfirm
 *    properties:
 *     name:
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
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required()
})

export default { loginSchema, signupSchema }
