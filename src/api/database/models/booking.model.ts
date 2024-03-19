import { v4 as uuidv4 } from 'uuid'
import mongoose, { Schema } from 'mongoose'
import { IBooking } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   BookingResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     cabinId:
 *      type: string
 *     guestId:
 *      type: string
 *     startDate:
 *      type: string
 *      format: date
 *     endDate:
 *      type: string
 *      format: date
 *     numNights:
 *      type: number
 *     numGuests:
 *      type: number
 *     cabinPrice:
 *      type: number
 *     extrasPrice:
 *      type: number
 *     totalPrice:
 *      type: number
 *     status:
 *      type: string
 *     hasBreakfast:
 *      type: boolean
 *     isPaid:
 *      type: boolean
 *     observation:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const bookingSchema = new Schema(
  {
    _id: {
      type: String,
      default: `booking-${uuidv4()}`,
      unique: true
      // required: true,
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
      default: 'c',
      enum: ['unconfirmed', 'confirmed', 'cancelled']
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
