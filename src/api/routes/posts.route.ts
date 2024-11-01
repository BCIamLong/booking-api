import { Router } from 'express'
import { asyncCatch } from '../utils'
import { postsController } from '../controllers'
import { authMiddleware, postMiddleware } from '../middlewares'
import { uploadConfig } from '~/config'

const { upload } = uploadConfig
const postsRouter = Router({ mergeParams: true })
const { getPost, getPosts, postPost, updatePost, deletePost } = postsController
const { checkPostCreateAbility, resizeAndUploadPostImageToCloud, postsQueryModifier } = postMiddleware
const { authenticate, auth2FA, authorize } = authMiddleware

postsRouter
  .route('/')
  .get(asyncCatch(getPosts))
  .post(
    // authenticate,
    authenticate,
    auth2FA,
    // postsQueryModifier,
    checkPostCreateAbility,
    asyncCatch(upload.single('image')),
    resizeAndUploadPostImageToCloud,
    asyncCatch(postPost)
  )

postsRouter
  .route('/:id')
  .get(asyncCatch(getPost))
  .patch(
    authenticate,
    auth2FA,
    postsQueryModifier,
    asyncCatch(upload.single('image')),
    resizeAndUploadPostImageToCloud,
    asyncCatch(updatePost)
  )
  .delete(authenticate, auth2FA, postsQueryModifier, asyncCatch(deletePost))

export default postsRouter
