import { v4 as uuidv4 } from 'uuid'
import { Schema, model } from 'mongoose'
import { IReview } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   ReviewResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     review:
 *      type: string
 *     rating:
 *      type: number
 *     user:
 *      type: string
 *     cabin:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const reviewSchema = new Schema(
  {
    _id: {
      type: String,
      default: `review-${uuidv4()}`,
      unique: true
    },
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5]
    },
    user: {
      type: String,
      required: true,
      ref: 'Guest'
    },
    cabin: {
      type: String,
      required: true,
      ref: 'Cabin'
    }
  },
  {
    timestamps: true
  }
)

const Review = model<IReview>('Review', reviewSchema)
export default Review
