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
    otp2FAAuthUrl: String,
    otp2FAToken: String,
    enable2FA: {
      type: Boolean,
      default: false
    },
    updatePasswordToken: String,
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
  if (this.isModified('password') && !this.isNew) {
    //@ts-ignore
    this.passwordConfirm = undefined
    this.password = await bcrypt.hash(this.password, 10)
    this.updatedAt = new Date()
    // * because the change password process can happen in a certain time like 1 second because it's hash password right
    // * then to ensure that password changed time always happen some time with when we sign a new token we need to subtract to maybe 1 second
    // ? the reason why we need to do it is we need to compare the password changed at and the timestamp when we signed token
    // ? the case we have two or more users go in one account then if the one of both change password then all the rest users are using this account need to login again
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

userSchema.methods.createToken = async function () {
  const token = await crypto.randomBytes(64).toString('hex')
  const hashToken = await crypto.createHash('sha256').update(token).digest('hex')

  return hashToken
}

// export { userSchema }

const User = mongoose.model<IUser>('User', userSchema)

export default User
