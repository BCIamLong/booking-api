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
    password: {
      type: String,
      required: true
    },
    passwordConfirm: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
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

userSchema.methods.checkPwd = async function (plainPwd: string, hashPwd: string) {
  return await bcrypt.compare(plainPwd, hashPwd)
}

// export { userSchema }

const User = mongoose.model<IUser>('User', userSchema)

export default User
