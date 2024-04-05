import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import mongoose, { Schema } from 'mongoose'
import { IUser } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   UserResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     name:
 *      type: string
 *     email:
 *      type: string
 *     role:
 *      type: string
 *     password:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: `user-${uuidv4()}`,
      unique: true
      // required: true,
    },
    name: {
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
      default: true
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    },
    password: {
      type: String,
      required: true
    },
    passwordConfirm: {
      type: String,
      required: true
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenTimeout: Date
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  // console.log(this.isModified('password'))
  if (this.isModified('password')) {
    //@ts-ignore
    this.passwordConfirm = undefined
    this.password = await bcrypt.hash(this.password, 10)
    this.updatedAt = new Date()
    this.passwordChangedAt = new Date()
    this.passwordResetToken = undefined
    this.passwordResetTokenTimeout = undefined
    return next()
  }

  if (!this.isNew) return next()

  //@ts-ignore
  this.passwordConfirm = undefined
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.pre(/^find/, function (next) {
  //@ts-ignore
  this.select('-__v')
  next()
})

// * we can use ts-ignore to ignore this error when we use regex for the common find methods later on we will somehow fix this
// userSchema.pre('find', function (next) {
//   this.select('-__v')
//   next()
// })
// userSchema.pre('findOne', function (next) {
//   this.select('-__v')
//   next()
// })

// userSchema.methods = userSchema.methods || {}

// if (process.env.NODE_ENV !== 'test')
userSchema.methods.checkPwd = async function (plainPwd: string, hashPwd: string) {
  return await bcrypt.compare(plainPwd, hashPwd)
}

userSchema.methods.hashPwd = async function (pwd: string) {
  return await bcrypt.hash(pwd, 10)
}

userSchema.methods.createResetPasswordToken = async function () {
  const token = await crypto.randomBytes(64).toString('hex')
  const resetToken = await crypto.createHash('sha256').update(token).digest('hex')
  this.passwordResetToken = resetToken
  this.passwordResetTokenTimeout = new Date(Date.now() + 3 * 60 * 60 * 1000)

  return token
}

// export { userSchema }

const User = mongoose.model<IUser>('User', userSchema)

export default User
