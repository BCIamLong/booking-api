import { number, ref, required } from 'joi'
import mongoose, { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { IPost } from '~/api/interfaces'
import { appConfig } from '~/config'

const { appEmitter } = appConfig

const postSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => `post-${uuidv4()}`
    },
    userId: {
      type: String,
      required: true,
      ref: 'Guest'
    },
    tourId: {
      type: String,
      required: true,
      ref: 'Tour'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [String],
    likes: [
      {
        userId: {
          type: String,
          required: true,
          ref: 'Guest'
        },
        likeAt: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    comments: [
      {
        userId: {
          type: String,
          required: true,
          ref: 'Guest'
        },
        content: {
          type: String,
          required: true
        },
        likes: [
          {
            userId: {
              type: String,
              required: true,
              ref: 'Guest'
            },
            likeAt: {
              type: Date,
              default: Date.now()
            }
          }
        ],
        commentAt: {
          type: Date,
          default: Date.now()
        },
        updateCommentAt: {
          type: Date,
          default: Date.now()
        }
      }
    ],
    shares: {
      type: Number,
      default: 0
    },
    bookmarks: [
      {
        userId: {
          type: String,
          required: true,
          ref: 'Guest'
        },
        bookmarkAt: {
          type: Date,
          default: Date.now()
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

postSchema.pre('find', function (next) {
  this.populate({ path: 'tourId', select: 'name' })
    .populate({ path: 'userId', select: 'fullName avatar' })
    .populate({ path: 'comments.userId', select: 'fullName avatar' })
    .populate({ path: 'likes.userId', select: 'fullName avatar' })
    .populate({ path: 'bookmarks.userId', select: 'fullName avatar' })
  next()
})

postSchema.pre('findOne', function (next) {
  this.populate({ path: 'tourId', select: 'name' })
    .populate({ path: 'userId', select: 'fullName avatar' })
    .populate({ path: 'comments.userId', select: 'fullName avatar' })
    .populate({ path: 'likes.userId', select: 'fullName avatar' })
    .populate({ path: 'bookmarks.userId', select: 'fullName avatar' })
  next()
})

postSchema.post(/^findOneAnd/, async function (doc, next) {
  appEmitter.emit('train-recommends')
  next()
})

postSchema.post('save', async function (doc, next) {
  appEmitter.emit('train-recommends')
  next()
})

// postSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $lookup: {
//       from: 'guests',
//       localField: 'userId',
//       foreignField: '_id',
//       as: 'users'
//     }
//   })
//   this.pipeline().unshift({
//     $lookup: {
//       from: 'guests',
//       // ! For the field like this comments.userId it will not work
//       localField: 'comments.userId',
//       foreignField: '_id',
//       as: 'users'
//     }
//   })
//   this.pipeline().unshift({
//     $lookup: {
//       from: 'guests',
//       localField: 'likes.userId',
//       foreignField: '_id',
//       as: 'users'
//     }
//   })
//   this.pipeline().unshift({
//     $lookup: {
//       from: 'guests',
//       localField: 'bookmarks.userId',
//       foreignField: '_id',
//       as: 'users'
//     }
//   })

//   this.pipeline().unshift({
//     $lookup: {
//       from: 'tours',
//       localField: 'tourId',
//       foreignField: '_id',
//       as: 'tours'
//     }
//   })

//   next()
// })

const Post = model<IPost>('Post', postSchema)

export default Post
