import crypto from 'crypto'
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { IGuest } from '~/api/interfaces'
import { appConfig } from '~/config'

const { appEmitter, SERVER_ORIGIN } = appConfig

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
    updatePasswordToken: String,
    verifyEmailToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenTimeout: Date
  },
  {
    timestamps: true
  }
)

guestSchema.pre('save', async function (next) {
  // console.log(this.isModified('password'))
  // console.log(this.isNew)
  if (this.isModified('password') && !this.isNew) {
    // console.log('ok')
    //@ts-ignore
    this.passwordConfirm = undefined
    this.password = await bcrypt.hash(this.password, 10)
    this.updatedAt = new Date()
    this.passwordChangedAt = new Date(Date.now() - 1000)
    this.passwordResetToken = undefined
    this.passwordResetTokenTimeout = undefined
    this.updatePasswordToken = undefined
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
  // *DELETE THE verifyEmailToken after we verify email because we use findAndUpdateGuest to update and cache the user then we need to remove this verifyEmailToken in this post hook of findOneAndUpdate
  if (doc?.verifyEmail && doc?.verifyEmailToken) {
    doc.verifyEmailToken = undefined
    await doc.save({ validateBeforeSave: false })
  }
  // const newDoc = this.getFilter()
  // console.log(doc)
  // console.log(newDoc)
  // if (!doc) return
  // if (doc?.verifyEmail) return
  // const url = `${SERVER_ORIGIN}/api/v1/auth/verify-email/${doc.verifyEmailToken}`

  // appEmitter.signup(doc, url)
  next()
})

guestSchema.post('save', async function (doc, next) {
  // const newDoc = this.getFilter()
  // console.log(doc)
  // console.log(newDoc)
  if (!doc) return
  if (doc?.verifyEmail) return
  const url = `${SERVER_ORIGIN}/api/v1/auth/verify-email/${doc.verifyEmailToken}`

  appEmitter.signup(doc as IGuest, url)
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

guestSchema.methods.createResetPasswordToken = async function () {
  const token = await crypto.randomBytes(64).toString('hex')
  const resetToken = await crypto.createHash('sha256').update(token).digest('hex')
  this.passwordResetToken = resetToken
  this.passwordResetTokenTimeout = new Date(Date.now() + 3 * 60 * 60 * 1000)

  return token
}

guestSchema.methods.createToken = async function () {
  const token = await crypto.randomBytes(64).toString('hex')
  const hashToken = await crypto.createHash('sha256').update(token).digest('hex')

  return hashToken
}

const Guest = mongoose.model<IGuest>('Guest', guestSchema)

export default Guest
