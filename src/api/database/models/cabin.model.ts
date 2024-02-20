import mongoose, { Schema } from 'mongoose'
import { ICabin } from '~/api/interfaces'

const cabinSchema = new Schema(
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
    maxCapacity: {
      type: Number,
      required: true
    },
    regularPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Cabin = mongoose.model<ICabin>('Cabin', cabinSchema)

export default Cabin
