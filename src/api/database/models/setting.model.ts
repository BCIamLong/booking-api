import mongoose, { Schema } from 'mongoose'
import { ISetting } from '~/api/interfaces'

const settingSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true
    },
    minBookingLength: {
      type: Number,
      required: true
    },
    maxBookingLength: {
      type: Number,
      required: true
    },
    maxGuestsPersonal: {
      type: Number,
      required: true
    },
    breakfastPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Setting = mongoose.model<ISetting>('Setting', settingSchema)

export default Setting
