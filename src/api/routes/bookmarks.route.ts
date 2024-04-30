import { Router } from 'express'

import { bookmarksController } from '../controllers'
import { asyncCatch } from '../utils'

const bookmarksRouter = Router()
const { getBookmark, getBookmarks, postBookmark, updateBookmark, deleteBookmark } = bookmarksController

bookmarksRouter.route('/').get(asyncCatch(getBookmarks)).post(asyncCatch(postBookmark))

bookmarksRouter
  .route('/:id')
  .get(asyncCatch(getBookmark))
  .patch(asyncCatch(updateBookmark))
  .delete(asyncCatch(deleteBookmark))

export default bookmarksRouter
