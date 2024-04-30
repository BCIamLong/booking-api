import { Bookmark } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { IBookmark } from '../interfaces'
import { IBookmarkInput } from '../interfaces/IBookmark'
// import { AppError } from '../utils'

const fetchBookmarks = fetchAll<IBookmark>(Bookmark)
const fetchBookmark = fetchOne<IBookmark>(Bookmark)
const createBookmark = createOne<IBookmark, IBookmarkInput>(Bookmark)
const editBookmark = editOne<IBookmark>(Bookmark)
const removeBookmark = removeOne<IBookmark>(Bookmark)

export default { fetchBookmark, fetchBookmarks, createBookmark, editBookmark, removeBookmark }
