import { Router } from 'express'
import { usersController, authController } from '../controllers'
import { asyncCatch } from '../utils'
import { validator, userSchema, authSchema } from '../validators'
import { authMiddleware } from '../middlewares'

const { createUserSchema, updateUserSchema } = userSchema
const { loginSchema, signupSchema, forgotPwdSchema, resetPwdSchema } = authSchema
const { login, signup, loginWithGoogle, verifyEmail, forgotPassword, checkResetPasswordToken, resetPassword } =
  authController
const { authenticate, authorize } = authMiddleware
const { getUsers, getUser, postUser, updateUser, deleteUser } = usersController
const userRouter = Router()

userRouter.get('/login/oauth/google', asyncCatch(loginWithGoogle))

/**
 * @openapi
 * '/api/v1/users/login':
 *  post:
 *   tags:
 *   - Auth
 *   security: []
 *   summary: login user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/LoginInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/UserResponse'
 *    400:
 *     description: Bad request
 *    500:
 *     description: Something went wrong
 */
userRouter.post('/signup', validator(signupSchema), asyncCatch(signup))

/**
 * @openapi
 * '/api/v1/users/signup':
 *  post:
 *   tags:
 *   - Auth
 *   security: []
 *   summary: signup user
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/SignupInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/UserResponse'
 *    400:
 *     description: Bad request
 *    409:
 *     description: Conflict
 *    500:
 *     description: Something went wrong
 */
userRouter.post('/login', validator(loginSchema), asyncCatch(login))

/**
 * @openapi
 * '/api/v1/users/verify-email':
 *  get:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: verify the user email
 *   responses:
 *    200:
 *     description: Success
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Not found
 *    500:
 *     description: Something went wrong
 */
userRouter.get('/verify-email', asyncCatch(verifyEmail))

/**
 * @openapi
 * '/api/v1/users/reset-password/{token}':
 *  patch:
 *   tags:
 *   - Auth
 *   security: []
 *   summary: help user send request to require reset password
 *   parameters:
 *    - name: token
 *      in: path
 *      description: the token for reset password
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/ResetPasswordInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/ResetPasswordResponse`'
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
userRouter.patch('/reset-password/:token', validator(resetPwdSchema), asyncCatch(resetPassword))

/**
 * @openapi
 * '/api/v1/users/reset-password/{token}/verify':
 *  get:
 *   tags:
 *   - Auth
 *   security: []
 *   summary: verify the reset password token
 *   parameters:
 *    - name: token
 *      in: path
 *      description: the token for reset password
 *      required: true
 *   responses:
 *    200:
 *     description: Success
 *    401:
 *     description: unauthorized
 *    500:
 *     description: Something went wrong
 */
userRouter.get('/reset-password/:token/verify', asyncCatch(checkResetPasswordToken))

/**
 * @openapi
 * '/api/v1/users/forgot-password':
 *  post:
 *   tags:
 *   - Auth
 *   security: []
 *   summary: help user send request to require reset password
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/ForgotPasswordInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/ForgotPasswordResponse'
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
userRouter.post('/forgot-password', validator(forgotPwdSchema), asyncCatch(forgotPassword))

// ! ONLY USERS LOGGED IN
userRouter.use(authenticate)

// ! ONLY ADMIN
userRouter.use(authorize('admin'))

userRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/users':
   *  get:
   *   tags:
   *   - User
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get all users
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           users:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/UserResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getUsers))
  /**
   * @openapi
   * '/api/v1/users':
   *  post:
   *   tags:
   *   - User
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create user
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateUserInput'
   *   responses:
   *    201:
   *     description: Success create new data
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           user:
   *            $ref: '#/components/schemas/UserResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(validator(createUserSchema), asyncCatch(postUser))

userRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/users/{id}':
   *  get:
   *   tags:
   *   - User
   *   summary: get a user with user id
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the user
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/UserResponse'
   *    404:
   *     description: No user found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getUser))
  /**
   * @openapi
   * '/api/v1/users/{id}':
   *  patch:
   *   tags:
   *   - User
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: update an user with the user id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the user
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateUserInput'
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           user:
   *            $ref: '#components/schemas/UserResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No user found
   *    500:
   *     description: Something went wrong
   */
  .patch(validator(updateUserSchema), asyncCatch(updateUser))
  /**
   * @openapi
   * '/api/v1/users/{id}':
   *  delete:
   *   tags:
   *   - User
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a user with the user id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the user
   *     required: true
   *   responses:
   *    204:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: null
   *    404:
   *     description: No user found
   *    500:
   *     description: Something went wrong
   */
  .delete(asyncCatch(deleteUser))

export default userRouter
