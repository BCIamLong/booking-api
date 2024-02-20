import mongoose, { Schema } from 'mongoose'
import { IGuest } from '~/api/interfaces'

const guestSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
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

const Guest = mongoose.model<IGuest>('Guest', guestSchema)

export default Guest
