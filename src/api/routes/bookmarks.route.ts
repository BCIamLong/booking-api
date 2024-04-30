import { Router } from 'express'

import { asyncCatch } from '../utils'
import { bookmarksController } from '../controllers'
import { authMiddleware, bookmarkMiddleware } from '../middlewares'
import { validator, bookmarkSchema } from '../validators'

const bookmarksRouter = Router()
const { getBookmark, getBookmarks, postBookmark, updateBookmark, deleteBookmark } = bookmarksController
const { auth2FA, authenticate, authorize } = authMiddleware
const { createBookmarkSchema, updateBookmarkSchema } = bookmarkSchema
const { bookmarksQueryModifier } = bookmarkMiddleware

bookmarksRouter.use(authenticate, auth2FA)

bookmarksRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/bookmarks':
   *  get:
   *   tags:
   *   - Bookmark
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get all bookmarks
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
   *           bookmarks:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/BookmarkResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getBookmarks))
  /**
   * @openapi
   * '/api/v1/cabins/{cabinId}/bookmarks':
   *  post:
   *   tags:
   *   - Bookmark
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: create bookmark for a cabin
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateBookmarkInput'
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
   *           bookmark:
   *            $ref: '#/components/schemas/BookmarkResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(authorize('user'), bookmarksQueryModifier, validator(createBookmarkSchema), asyncCatch(postBookmark))

bookmarksRouter
  .route('/:id')
  /**
   * @openapi
   * '/api/v1/bookmarks/{id}':
   *  get:
   *   tags:
   *   - Bookmark
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: get a bookmark with bookmark id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the bookmark
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/BookmarkResponse'
   *    404:
   *     description: No bookmark found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getBookmark))
  /**
   * @openapi
   * '/api/v1/bookmarks/{id}':
   *  patch:
   *   tags:
   *   - Bookmark
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: update an bookmark with the bookmark id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the bookmark
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateBookmarkInput'
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
   *           bookmark:
   *            $ref: '#components/schemas/BookmarkResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No bookmark found
   *    500:
   *     description: Something went wrong
   */
  .patch(asyncCatch(updateBookmark))
  /**
   * @openapi
   * '/api/v1/bookmarks/{id}':
   *  delete:
   *   tags:
   *   - Bookmark
   *   security:
   *    - bearerAuth: []
   *    - cookieAuth: []
   *    - refreshCookieAuth: []
   *   summary: delete a bookmark with the bookmark id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the bookmark
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
   *     description: No bookmark found
   *    500:
   *     description: Something went wrong
   */
  .delete(asyncCatch(deleteBookmark))

export default bookmarksRouter
