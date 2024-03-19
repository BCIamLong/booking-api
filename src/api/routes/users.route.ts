import { Router } from 'express'
import { usersController } from '../controllers'
import { asyncCatch } from '../utils'
import { validator, userSchema } from '../validators'

const { createUserSchema, updateUserSchema } = userSchema
const { getUsers, getUser, postUser, updateUser, deleteUser } = usersController
const userRouter = Router()

userRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/users':
   *  get:
   *   tags:
   *   - User
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
