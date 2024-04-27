import { v4 as uuidv4 } from 'uuid'
import mongoose, { Model, Schema, model } from 'mongoose'
import { IReview } from '~/api/interfaces'
import Cabin from './cabin.model'

/**
 * @openapi
 * components:
 *  schemas:
 *   ReviewResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     review:
 *      type: string
 *     rating:
 *      type: number
 *     user:
 *      type: string
 *     cabin:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const reviewSchema = new Schema(
  {
    _id: {
      type: String,
      default: `review-${uuidv4()}`
      //* _id will already have this in place, that is we cannot have _id to have non-unique value even if the condition from mongoose is not there and it is always required.
      // * so by default mongoose is always set this _id property to unique, therefore the error here that we overwrite this unique property and maybe this property _id always have this unique like it can be change outside right so it might be private
      // * so therefore if we custom this _id we should not set the unique property of the _id
      // unique: true
    },
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5]
    },
    user: {
      type: String,
      required: true,
      ref: 'Guest'
    },
    cabin: {
      type: String,
      required: true,
      ref: 'Cabin'
    }
  },
  {
    timestamps: true
    // _id: false
  }
)

reviewSchema.index({ cabin: 1, user: 1 }, { unique: true })

reviewSchema.methods.updateCabinWithReview = async function (model: Model<IReview>, cabinId: string) {
  const stats = await model.aggregate([
    {
      $match: { cabin: cabinId }
    },
    {
      $group: {
        _id: null,
        ratingQuantity: { $sum: 1 },
        ratingAverage: { $avg: '$rating' }
      }
    }
  ])

  console.log(stats) //* [ { _id: '$cabin4', ratingQuantity: 4, ratingAverage: 4 } ]
  const ratingQuantity = stats[0]?.ratingQuantity || 0
  const ratingAverage = stats[0]?.ratingAverage || 5
  // await this.model('Cabin').findByIdAndUpdate(
  await Cabin.findByIdAndUpdate(
    cabinId,
    // doc.cabin.split('$')[1],
    { ratingQuantity, ratingAverage },
    {
      runValidators: true
    }
  )
}

reviewSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate({
    path: 'user',
    select: 'fullName avatar'
  }).populate({ path: 'cabin', select: 'name' })

  next()
})

reviewSchema.post(
  'findOneAndDelete',
  async function (doc: IReview & { updateCabinWithReview: (model: Model<IReview>, cabinId: string) => void }, next) {
    doc.updateCabinWithReview(mongoose.model<IReview>('Review'), doc.cabin)
    next()
  }
)

reviewSchema.post(
  'findOneAndUpdate',
  async function (doc: IReview & { updateCabinWithReview: (model: Model<IReview>, cabinId: string) => void }, next) {
    doc.updateCabinWithReview(mongoose.model<IReview>('Review'), doc.cabin)
    next()
  }
)

reviewSchema.post(
  'save',
  async function (doc: IReview & { updateCabinWithReview: (model: Model<IReview>, cabinId: string) => void }, next) {
    doc.updateCabinWithReview(mongoose.model<IReview>('Review'), doc.cabin)
    // doc.updateCabinWithReview(this.model('Review'), doc.cabin)

    // const stats = await this.model('Review').aggregate([
    //   {
    //     $match: { cabin: doc.cabin }
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       ratingQuantity: { $sum: 1 },
    //       ratingAverage: { $avg: '$rating' }
    //     }
    //   }
    // ])
    // // console.log(stats) //* [ { _id: '$cabin4', ratingQuantity: 4, ratingAverage: 4 } ]
    // const { ratingQuantity, ratingAverage } = stats[0] || {}
    // // await this.model('Cabin').findByIdAndUpdate(
    // await Cabin.findByIdAndUpdate(
    //   doc.cabin,
    //   // doc.cabin.split('$')[1],
    //   { ratingQuantity, ratingAverage },
    //   {
    //     runValidators: true
    //   }
    // )
    next()
  }
)

const Review = model<IReview>('Review', reviewSchema)
export default Review
