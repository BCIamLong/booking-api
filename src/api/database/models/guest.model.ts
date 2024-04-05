import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import { IGuest } from '~/api/interfaces'
import { appConfig } from '~/config'

const { appEmitter } = appConfig

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
 *     verifyEmail:
 *      type: boolean
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
    verifyEmail: {
      type: Boolean,
      default: false
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
    passwordResetToken: String,
    passwordResetTokenTimeout: Date
  },
  {
    timestamps: true
  }
)

guestSchema.pre('save', async function (next) {
  console.log(this.isModified('password'))
  if (this.isModified('password')) {
    //@ts-ignore
    this.passwordConfirm = undefined
    this.password = await bcrypt.hash(this.password, 10)
    return next()
  }

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

guestSchema.post('findOneAndUpdate', async function (doc, next) {
  // const newDoc = this.getFilter()
  // console.log(doc)
  // console.log(newDoc)
  if (!doc) return
  if (doc?.verifyEmail) return
  const url = `http://localhost:3009/api/v1/users/verify-email`

  appEmitter.signup(doc, url)
  next()
})

// guestSchema.methods = guestSchema.methods || {}

// if (process.env.NODE_ENV !== 'test')
guestSchema.methods.checkPwd = async function (plainPwd: string, hashPwd: string) {
  return await bcrypt.compare(plainPwd, hashPwd)
}

guestSchema.methods.hashPwd = async function (pwd: string) {
  return await bcrypt.hash(pwd, 10)
}

const Guest = mongoose.model<IGuest>('Guest', guestSchema)

export default Guest
