import { Document } from 'mongoose'

export interface IBookmarkInput {
  user: string
  cabin: string
  link: string
  createdAt: Date
  updatedAt: Date
}

export default interface IBookmark extends IBookmarkInput, Document {
  _id: string
}
