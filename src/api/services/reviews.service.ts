import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import { Review } from '../database/models'
import { IReview } from '../interfaces'
import { IReviewInput } from '../interfaces/IReview'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'

const fetchReviews = fetchAll<IReview>(Review)
const fetchReview = fetchOne<IReview>(Review)
const createReview = createOne<IReview, IReviewInput>(Review)
const editReview = editOne<IReview>(Review)
const removeReview = removeOne<IReview>(Review)

// const findAndUpdateReview = async function (
//   query: FilterQuery<IReview>,
//   update: UpdateQuery<IReview>,
//   options: QueryOptions = {}
// ) {
//   return Review.findOneAndUpdate(query, update, options)
//   // return Guest.findOneAndUpdate(query, update, options)
// }

export default {
  fetchReviews,
  fetchReview,
  createReview,
  editReview,
  removeReview
  // findAndUpdateReview
}
