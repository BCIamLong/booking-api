import { Router } from 'express'
import { asyncCatch } from '../utils'
import { postsController } from '../controllers'
import { authMiddleware, postMiddleware } from '../middlewares'
import { uploadConfig } from '~/config'

const { upload } = uploadConfig
const postsRouter = Router({ mergeParams: true })
const { getPost, getPosts, postPost, updatePost, deletePost, updatePostComments, getRandomPosts } = postsController
const { checkPostCreateAbility, resizeAndUploadPostImageToCloud, postsQueryModifier } = postMiddleware
const { authenticate, auth2FA, authorize } = authMiddleware

postsRouter.patch('/:id/comments/:commentId', authenticate, auth2FA, postsQueryModifier, asyncCatch(updatePostComments))

postsRouter.get('/random', asyncCatch(getRandomPosts))

postsRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/posts':
   *  get:
   *   tags:
   *   - Post
   *   summary: get all posts
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
   *         count:
   *          type: number
   *         results:
   *          type: number
   *         data:
   *          type: object
   *          properties:
   *           posts:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/PostResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getPosts))
  /**
   * @openapi
   * '/api/v1/posts':
   *  post:
   *   tags:
   *   - Post
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create post
   *   requestBody:
   *    required: true
   *    content:
   *     multipart/form-data:
   *      schema:
   *       $ref: '#components/schemas/CreatePostInput'
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
   *           post:
   *            $ref: '#/components/schemas/PostResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   */
  .post(
    // authenticate,
    authenticate,
    auth2FA,
    // postsQueryModifier
    checkPostCreateAbility,
    asyncCatch(upload.single('image')),
    resizeAndUploadPostImageToCloud,
    asyncCatch(postPost)
  )

postsRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/posts/{id}':
   *  get:
   *   tags:
   *   - Post
   *   summary: get a post with post id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the post
   *      required: true
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
   *           post:
   *            $ref: '#/components/schemas/PostResponse'
   *    404:
   *     description: No post found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getPost))
  /**
   * @openapi
   * '/api/v1/posts':
   *  patch:
   *   tags:
   *   - Post
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: Update post
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdatePostInput'
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
   *           post:
   *            $ref: '#/components/schemas/PostResponse'
   *
   *    400:
   *     description: Bad request
   *    404:
   *     description: No post found
   *    500:
   *     description: Something went wrong
   */
  .patch(
    authenticate,
    auth2FA,
    postsQueryModifier,
    asyncCatch(upload.single('image')),
    resizeAndUploadPostImageToCloud,
    asyncCatch(updatePost)
  )
  /**
   * @openapi
   * '/api/v1/posts/{id}':
   *  delete:
   *   tags:
   *   - Post
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a post with the post id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the post
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
   *     description: No post found
   *    500:
   *     description: Something went wrong
   */
  .delete(authenticate, auth2FA, postsQueryModifier, asyncCatch(deletePost))

export default postsRouter
