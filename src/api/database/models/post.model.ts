import { required } from 'joi'
import mongoose, { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { IPost } from '~/api/interfaces'

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => `tour-${uuidv4()}`
    },
    userId: {
      type: String,
      required: true,
      ref: 'Guest'
    },
    tourId: {
      type: String,
      required: true,
      ref: 'Tour'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [String],
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const Post = model<IPost>('Post', postSchema)

export default Post
