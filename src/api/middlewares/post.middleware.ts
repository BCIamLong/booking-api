import { NextFunction, Request, Response } from 'express'
import { UploadApiResponse } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid'

import { uploadConfig } from '~/config'
import { Booking, Post } from '../database/models'
import { AppError } from '../utils'

const { cloudinary } = uploadConfig

const checkPostCreateAbility = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { tourId, userId } = req.body

    // const isTourBooked = await Booking.findOne({ cabinId: tourId, guestId: userId })
    // if (!isTourBooked) return next(new AppError(400, 'Bad request'))

    const isPostExisted = await Post.findOne({ tourId })
    if (isPostExisted) return next(new AppError(400, 'Bad request'))

    next()
  } catch (err) {
    next(err)
  }
}

const resizeAndUploadPostImageToCloud = async function (req: Request, res: Response, next: NextFunction) {
  // console.log(req.file)
  if (!req.file) return next()
  try {
    // const fileName = `user-${req.user._id}-${Date.now()}`
    const fileName = `post-${uuidv4()}`

    // * To get the data we need to make this to Promise because cloudinary.uploader.upload_stream itself doesn't promisify so we need to make this promise and then get the value resolve from this Promise
    // * and also this task is stream and it's definitely the async task right so therefore to get response data we need to promisify it
    // * https://cloudinary.com/documentation/node_image_and_video_upload#node_js_upload_stream
    const data: UploadApiResponse = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            quality: 'auto:best',
            width: 300,
            height: 300,
            crop: 'fill',
            // * because we use format to jpg so we don't need specify the extension
            // * if we don't use format then we should specify the extension
            filename_override: fileName,
            public_id: `booking-app/images/posts/${fileName}`,
            format: 'jpg'
          },
          async (err, result) => {
            if (err) throw err

            return resolve(result!)
            // req.fileName = result?.secure_url as string
            // console.log(result?.url) //* doesn't have SSL so just http
            // console.log(result?.secure_url) //* have SSL so it's https
          }
        )
        .end(req?.file?.buffer)
    })

    // console.log(data)
    // * store the secure url from data to req.fileName which is what we will store to DB later
    req.fileName = data.secure_url
    req.body['images'] = [req.fileName]

    next()
  } catch (err) {
    next(err)
  }
}

export default { checkPostCreateAbility, resizeAndUploadPostImageToCloud }
