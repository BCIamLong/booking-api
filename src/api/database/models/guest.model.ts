import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
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
 *     role:
 *      type: string
 *     avatar:
 *      type: string
 *     password:
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
      default: `guest-${uuidv4()}`,
      unique: true
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      type: String,
      default: 'default-avatar.jpg'
    },
    password: {
      type: String,
      required: true
    },
    passwordConfirm: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user']
    },
    nationalId: {
      type: String,
      default: 'none'
      // required: true
    },
    nationality: {
      type: String,
      default: 'none'
      // required: true
    },
    countryFlag: {
      type: String,
      default: 'none'
      // required: true
    },
    passwordChangedAt: Date,
    passwordResetTokenTimeout: Date
  },
  {
    timestamps: true
  }
)

guestSchema.pre('save', async function (next) {
  if (!this.isNew) return next()

  //@ts-ignore
  this.passwordConfirm = undefined
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

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

guestSchema.methods.checkPwd = async function (plainPwd: string, hashPwd: string) {
  return await bcrypt.compare(plainPwd, hashPwd)
}

const Guest = mongoose.model<IGuest>('Guest', guestSchema)

export default Guest
