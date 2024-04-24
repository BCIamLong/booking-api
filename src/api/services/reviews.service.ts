import { Review } from '../database/models'
import { IReview } from '../interfaces'
import { IReviewInput } from '../interfaces/IReview'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'

const fetchReviews = fetchAll<IReview>(Review)
const fetchReview = fetchOne<IReview>(Review)
const createReview = createOne<IReview, IReviewInput>(Review)
const editReview = editOne<IReview>(Review)
const removeReview = removeOne<IReview>(Review)

export default { fetchReviews, fetchReview, createReview, editReview, removeReview }
