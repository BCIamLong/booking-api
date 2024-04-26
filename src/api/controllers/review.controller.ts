import { reviewsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchReviews, fetchReview, editReview, createReview, removeReview } = reviewsService

const getReviews = getAll(async (options) => {
  const { data, collectionName } = await fetchReviews(options.queryStr)
  return { data, collectionName }
})
const getReview = getOne(async (options) => {
  const { data, collectionName } = await fetchReview(options.id || '')
  return { data, collectionName }
})
const postReview = postOne(async (options) => {
  const { data, collectionName } = await createReview(options.body || {})

  return { data, collectionName }
})
const updateReview = updateOne(async (options) => {
  const { data, collectionName } = await editReview(options.id || '', options.body || {})

  return { data, collectionName }
})
const deleteReview = deleteOne(async (options) => {
  const { data, collectionName } = await removeReview(options.id || '')

  return { data, collectionName }
})

export default { getReviews, getReview, postReview, updateReview, deleteReview }
