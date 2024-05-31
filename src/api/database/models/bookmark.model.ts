import { v4 as uuidv4 } from 'uuid'
import { Schema, model } from 'mongoose'

import Cabin from './cabin.model'
import Guest from './guest.model'
import { IBookmark } from '~/api/interfaces'
import { AppError } from '~/api/utils'

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
      default: () => `bookmark-${uuidv4()}`
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

bookmarkSchema.pre('save', async function (next) {
  const { cabin } = this
  // * we have authenticate to check the current user therefore we don't need do this
  // const isUserExist = await Guest.findById(user)
  // if(isUserExist) throw new AppError(400, )
  const isCabinExist = await Cabin.findById(cabin)
  if (!isCabinExist) throw new AppError(400, "We have no way to bookmark the cabin doesn't exist")

  next()
})

bookmarkSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate('cabin')
  next()
})

const Bookmark = model<IBookmark>('Bookmark', bookmarkSchema)

export default Bookmark
