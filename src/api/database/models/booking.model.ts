import mongoose, { Schema } from 'mongoose'
import { IBooking } from '~/api/interfaces'

const bookingSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true
    },
    cabinId: {
      type: String,
      ref: 'Cabin',
      required: true
    },
    guestId: {
      type: String,
      ref: 'Guest',
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    numNights: {
      type: Number,
      required: true
    },
    numGuests: {
      type: Number,
      required: true
    },
    cabinPrice: {
      type: Number,
      required: true
    },
    extrasPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: 'unconfirmed',
      enum: ['unconfirmed', 'confirmed', 'cancel']
    },
    hasBreakfast: {
      type: Boolean,
      default: false
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    observation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// *https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
bookingSchema.index({ cabinId: 1, guestId: -1 })

const Booking = mongoose.model<IBooking>('Booking', bookingSchema)

export default Booking
