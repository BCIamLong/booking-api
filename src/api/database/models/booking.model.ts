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
      default: () => `booking-${uuidv4()}`
      // unique: true
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
      default: 'unconfirmed',
      enum: ['unconfirmed', 'confirmed', 'checked-in', 'checked-out', 'cancelled']
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

bookingSchema.pre(/^find/, async function (next) {
  // const data = await mongoose.model('Booking').aggregate([
  //   {
  //     $match: {
  //       endDate: { $lt: new Date() }
  //     }
  //   },
  //   {
  //     $set: {
  //       status: 'checked-out'
  //     }
  //   }
  // ])
  // * update the status automatically if the endDate is less than the current date
  await mongoose.model('Booking').updateMany(
    { endDate: { $lt: new Date() }, status: { $ne: 'checked-out' } },
    {
      $set: {
        status: 'checked-out'
      }
    }
  )
  // console.log(data)

  // @ts-ignore
  this.populate({ path: 'cabinId', select: 'name discount' })
  next()
})

bookingSchema.post('save', function (doc, next) {
  next()
})

const Booking = mongoose.model<IBooking>('Booking', bookingSchema)

export default Booking
