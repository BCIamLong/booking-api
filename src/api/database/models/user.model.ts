import mongoose, { Schema } from 'mongoose'
import { IUser } from '~/api/interfaces'

const userSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
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

const User = mongoose.model<IUser>('User', userSchema)

export default User
