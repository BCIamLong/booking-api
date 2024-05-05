import { Router } from 'express'
import { validator, authSchema } from '../validators'
import { authMiddleware, uploadMiddleware } from '../middlewares'
import { authController } from '../controllers'
import { asyncCatch } from '../utils'
import { uploadConfig } from '~/config'
import reviewRouter from './review.route'
import bookmarksRouter from './bookmarks.route'

const { upload } = uploadConfig

const authRouter = Router()
const {
  loginSchema,
  signupSchema,
  forgotPwdSchema,
  resetPwdSchema,
  updateCurrentUserSchema,
  checkCurrentPasswordSchema,
  updatePasswordSchema,
  verify2FAOtpSchema,
  validate2FAOtpSchema
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
  updatePassword,
  deleteCurrentUser,
  generate2FAOtp,
  verify2FAOtp,
  validate2FAOtp,
  disable2FA,
  getUserSession,
  getCurrentUser
} = authController
const { authenticate, auth2FA } = authMiddleware
const { resizeAndUploadAvatarToCloud } = uploadMiddleware

authRouter.use('/me/reviews', reviewRouter)
authRouter.use('/me/bookmarks', bookmarksRouter)

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
// * IT CAN IMPLEMENT SOME AUTHENTICATION WITH BEARER TOKEN, COOKIE WITH ITSELF AND DO NOT USE AUTHENTICATE BECAUSE AUTHENTICATE CHECK USER VERIFY EMAIL
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

// ! ONLY USERS LOGGED IN
authRouter.use(authenticate)

/**
 * @openapi
 * '/api/v1/auth/session':
 *  get:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: get the user session
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
 *         session:
 *          type: object
 *          properties:
 *           user:
 *            type: object
 *    401:
 *     description: Unauthorized
 *    404:
 *     description: Not found
 *    500:
 *     description: Something went wrong
 */
authRouter.get('/session', asyncCatch(getUserSession))

/**
 * @openapi
 * '/api/v1/auth/2FA/validate-otp':
 *  post:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: validate otp code of 2FA authentication to login
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/Validate2FAOtpInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/Validate2FAOtpResponse'
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.post('/2FA/validate-otp', validator(validate2FAOtpSchema), asyncCatch(validate2FAOtp))

authRouter.use(auth2FA)

authRouter
  .route('/me')
  /**
   * @openapi
   * '/api/v1/auth/me':
   *  get:
   *   tags:
   *   - Auth
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get the current user
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
   *    401:
   *     description: Unauthorized
   *    403:
   *     description: Forbidden
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getCurrentUser))
  /**
   * @openapi
   * '/api/v1/auth/me':
   *  post:
   *   tags:
   *   - Auth
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete the user themselves
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/DeleteCurrentUserInput'
   *   responses:
   *    204:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#components/schemas/DeleteCurrentUserResponse'
   *    400:
   *     description: Bad request
   *    401:
   *     description: Unauthorized
   *    500:
   *     description: Something went wrong
   */
  .post(asyncCatch(deleteCurrentUser))
  /**
   * @openapi
   * '/api/v1/auth/me':
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
  .patch(
    asyncCatch(upload.single('avatar')),
    resizeAndUploadAvatarToCloud,
    validator(updateCurrentUserSchema),
    asyncCatch(updateCurrentUser)
  )

/**
 * @openapi
 * '/api/v1/auth/2FA/generate-otp':
 *  get:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: generate the otp code for enable their 2FA authentication
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
 *         token:
 *          type: string
 *         URI:
 *          type: string
 *    401:
 *     description: unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.get('/2FA/generate-otp', asyncCatch(generate2FAOtp))

/**
 * @openapi
 * '/api/v1/auth/2FA/verify-otp':
 *  patch:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: verify otp code to finally enable 2FA authentication
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/Verify2FAOtpInput'
 *   responses:
 *    200:
 *     description: Success
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#components/schemas/Verify2FAOtpResponse'
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Something went wrong
 */
authRouter.patch('/2FA/verify-otp', validator(verify2FAOtpSchema), asyncCatch(verify2FAOtp))

/**
 * @openapi
 * '/api/v1/auth/2FA/disable':
 *  get:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
 *   summary: disable 2FA authentication
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
authRouter.get('/2FA/disable', asyncCatch(disable2FA))

/**
 * @openapi
 * '/api/v1/auth/logout':
 *  get:
 *   tags:
 *   - Auth
 *   security:
 *    - bearerAuth: []
 *    - cookieAuth: []
 *    - refreshCookieAuth: []
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

export default authRouter

// *   requestBody:
// *    required: true
// *    content:
// *     multipart/form-data:
// *      schema:
// *       $ref: '#components/schemas/UpdateCurrentUserInput'
