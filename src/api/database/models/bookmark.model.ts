import { v4 as uuidv4 } from 'uuid'
import { Schema, model } from 'mongoose'
import { IBookmark } from '~/api/interfaces'

const bookmarkSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4()
    },
    user: {
      type: String,
      ref: 'User',
      required: true
    },
    cabin: {
      type: String,
      ref: 'Cabin',
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Bookmark = model<IBookmark>('Bookmark', bookmarkSchema)

export default Bookmark
