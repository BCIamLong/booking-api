import { Router } from 'express'
import { asyncCatch } from '../utils'
import { postsController } from '../controllers'

const postsRouter = Router({ mergeParams: true })
const { getPost, getPosts, postPost, updatePost, deletePost } = postsController

postsRouter.route('/').get(asyncCatch(getPosts)).post(asyncCatch(postPost))
postsRouter.route('/:id').get(asyncCatch(getPost)).patch(asyncCatch(updatePost)).delete(asyncCatch(deletePost))

export default postsRouter
