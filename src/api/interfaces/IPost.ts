import { Document } from 'mongoose'

export interface IPostInput {
  tourId: string
  userId: string
  title: string
  description: string
  likes: number
  comments: number
  shares: number
  bookmarks: number
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export default interface IPost extends IPostInput, Document {
  _id: string
}
