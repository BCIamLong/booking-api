import { bookmarksService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchBookmarks, fetchBookmark, editBookmark, createBookmark, removeBookmark } = bookmarksService

const getBookmarks = getAll(async () => {
  const { data, collectionName } = await fetchBookmarks()
  return { data, collectionName }
})

const getBookmark = getOne(async (options) => {
  const { data, collectionName } = await fetchBookmark(options.id || '')
  return { data, collectionName }
})

const postBookmark = postOne(async (options) => {
  const { data, collectionName } = await createBookmark(options.body || {})

  return { data, collectionName }
})

const updateBookmark = updateOne(async (options) => {
  const { data, collectionName } = await editBookmark(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteBookmark = deleteOne(async (options) => {
  const { data, collectionName } = await removeBookmark(options)
  // const { data, collectionName } = await removeBookmark(options.id || '')

  return { data, collectionName }
})

export default { getBookmarks, getBookmark, postBookmark, updateBookmark, deleteBookmark }
