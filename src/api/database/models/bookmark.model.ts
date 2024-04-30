import { v4 as uuidv4 } from 'uuid'
import { Schema, model } from 'mongoose'
import { IBookmark } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   BookmarkResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     user:
 *      type: string
 *     cabin:
 *      type: string
 *     link:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const bookmarkSchema = new Schema(
  {
    _id: {
      type: String,
      default: `bookmark-${uuidv4()}`
    },
    user: {
      type: String,
      ref: 'Guest',
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
