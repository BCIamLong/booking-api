import { Router } from 'express'
import { asyncCatch } from '../utils'
import { postsController } from '../controllers'
import { postMiddleware } from '../middlewares'

const postsRouter = Router({ mergeParams: true })
const { getPost, getPosts, postPost, updatePost, deletePost } = postsController
const { checkPostCreateAbility } = postMiddleware

postsRouter.route('/').get(asyncCatch(getPosts)).post(checkPostCreateAbility, asyncCatch(postPost))

postsRouter.route('/:id').get(asyncCatch(getPost)).patch(asyncCatch(updatePost)).delete(asyncCatch(deletePost))

export default postsRouter
