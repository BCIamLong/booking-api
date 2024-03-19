import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateUserInput:
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
const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().min(8).required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateUserInput:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      default: John Doe
 *     email:
 *      type: string
 *      default: john@example.com
 */
const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  passwordConfirm: Joi.string().min(8)
})

// ? consider the admin permission to really allow the admin can change the password of the user

// *     password:
// *      type: string
// *      default: password123
// *     passwordConfirm:
// *      type: string
// *      default: password123

export default { createUserSchema, updateUserSchema }
