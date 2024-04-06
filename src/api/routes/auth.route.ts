import { Router } from 'express'
import { validator, authSchema } from '../validators'
import { authMiddleware, uploadMiddleware } from '../middlewares'
import { authController } from '../controllers'
import { asyncCatch } from '../utils'
import { uploadConfig } from '~/config'

const { upload } = uploadConfig

const authRouter = Router()
const {
  loginSchema,
  signupSchema,
  forgotPwdSchema,
  resetPwdSchema,
  updateCurrentUserSchema,
  checkCurrentPasswordSchema,
  updatePasswordSchema
} = authSchema
const {
  login,
  signup,
  loginWithGoogle,
  logout,
  verifyEmail,
  forgotPassword,
  checkResetPasswordToken,
  resetPassword,
  updateCurrentUser,
  checkCurrentPassword,
  updatePassword
} = authController
const { authenticate } = authMiddleware
const { resizeAndUploadAvatarToCloud } = uploadMiddleware

authRouter.get('/login/oauth/google', asyncCatch(loginWithGoogle))

/**
 * @openapi
 * '/api/v1/auth/login':
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
authRouter.post('/signup', validator(signupSchema), asyncCatch(signup))

/**
 * @openapi
 * '/api/v1/auth/signup':
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
authRouter.post('/login', validator(loginSchema), asyncCatch(login))

/**
 * @openapi
 * '/api/v1/auth/logout':
 *  get:
 *   tags:
 *   - Auth
 *   security: []
 *   summary: log user out of web app
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
 *         message:
 *          type: string
 *    401:
 *     description: unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.get('/logout', asyncCatch(logout))

/**
 * @openapi
 * '/api/v1/auth/reset-password/{token}':
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
authRouter.patch('/reset-password/:token', validator(resetPwdSchema), asyncCatch(resetPassword))

/**
 * @openapi
 * '/api/v1/auth/reset-password/{token}/verify':
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
authRouter.get('/reset-password/:token/verify', asyncCatch(checkResetPasswordToken))

/**
 * @openapi
 * '/api/v1/auth/forgot-password':
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
authRouter.post('/forgot-password', validator(forgotPwdSchema), asyncCatch(forgotPassword))

// ! ONLY USERS LOGGED IN
// * BECAUSE WE NEED TO VERIFY EMAIL AND AUTHENTICATE DON'T ALLOW USER IS NOT VERIFY EMAIL
// * SO THEREFORE THIS VERIFY EMAIL ROUTE HANDLER WILL VERIFY THE TOKEN WITH ITSELF AND WE DO NOT USE AUTHENTICATE MIDDLEWARE HERE
// authRouter.use(authenticate)

/**
 * @openapi
 * '/api/v1/auth/verify-email':
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
authRouter.get('/verify-email/:token', asyncCatch(verifyEmail))

authRouter.use(authenticate)

/**
 * @openapi
 * '/api/v1/auth/update-password/verify':
 *  post:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: verify the user to allow update password
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/CheckCurrentPasswordInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/CheckCurrentPasswordResponse'
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.post('/update-password/verify', validator(checkCurrentPasswordSchema), asyncCatch(checkCurrentPassword))

/**
 * @openapi
 * '/api/v1/auth/update-password/{token}':
 *  patch:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: update the user password
 *   parameters:
 *    - name: token
 *      in: path
 *      description: the token for verify user password
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/UpdatePasswordInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/UpdatePasswordResponse'
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.patch('/update-password/:token', validator(updatePasswordSchema), asyncCatch(updatePassword))

/**
 * @openapi
 * '/api/v1/auth/update-me':
 *  patch:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: update the user profile
 *   consumes:
 *    - multipart/form-data
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#components/schemas/UpdateCurrentUserInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/UpdateCurrentUserResponse'
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.patch(
  '/update-me',
  upload.single('avatar'),
  resizeAndUploadAvatarToCloud,
  validator(updateCurrentUserSchema),
  asyncCatch(updateCurrentUser)
)

export default authRouter

// *   requestBody:
// *    required: true
// *    content:
// *     multipart/form-data:
// *      schema:
// *       $ref: '#components/schemas/UpdateCurrentUserInput'
