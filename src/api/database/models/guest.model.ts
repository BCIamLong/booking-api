import mongoose, { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { IGuest } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   GuestResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     fullName:
 *      type: string
 *     email:
 *      type: string
 *     nationalId:
 *      type: string
 *     nationality:
 *      type: string
 *     countryFlag:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const guestSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4(),
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    nationalId: {
      type: String,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    countryFlag: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

guestSchema.pre('findOne', function (next) {
  this.select('-__v')
  next()
})

guestSchema.pre('find', function (next) {
  this.select('-__v')
  next()
})

// guestSchema.pre(/^find/, function (next) {
//   this.select('-__v')
//   next()
// })

const Guest = mongoose.model<IGuest>('Guest', guestSchema)

export default Guest
