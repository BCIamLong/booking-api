import { Document } from 'mongoose'

export interface IReviewInput {
  user: string
  cabin: string
  review: string
  rating: number
  createdAt: Date
  updatedAt: Date
}

export default interface IReview extends IReviewInput, Document {
  _id: string
}
