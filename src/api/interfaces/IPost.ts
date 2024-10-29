import { Document } from 'mongoose'

interface Like {
  id: string
  userId: string
  likeAt: Date
}

interface Comment {
  id: string
  userId: string
  content: string
  likes: Like[]
  commentAt: Date
  updateCommentAt: Date
}

interface Bookmark {
  id: string
  userId: string
  bookmarkAt: Date
}

export interface IPostInput {
  tourId: string
  userId: string
  title: string
  description: string
  likes: Like[]
  comments: Comment[]
  shares: number
  bookmarks: Bookmark[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export default interface IPost extends IPostInput, Document {
  _id: string
}
