import { Router } from 'express'
import { asyncCatch } from '../utils'
import { postsController } from '../controllers'
import { authMiddleware, postMiddleware } from '../middlewares'
import { uploadConfig } from '~/config'

const { upload } = uploadConfig
const postsRouter = Router({ mergeParams: true })
const { getPost, getPosts, postPost, updatePost, deletePost } = postsController
const { checkPostCreateAbility, resizeAndUploadPostImageToCloud } = postMiddleware
const { authenticate } = authMiddleware

postsRouter
  .route('/')
  .get(asyncCatch(getPosts))
  .post(
    // authenticate,
    checkPostCreateAbility,
    asyncCatch(upload.single('image')),
    resizeAndUploadPostImageToCloud,
    asyncCatch(postPost)
  )

postsRouter.route('/:id').get(asyncCatch(getPost)).patch(asyncCatch(updatePost)).delete(asyncCatch(deletePost))

export default postsRouter
