import sharp from 'sharp'
import { UploadApiResponse } from 'cloudinary'
import { Request, Response, NextFunction } from 'express'
import { uploadConfig } from '~/config'

const { cloudinary } = uploadConfig

const resizeAndUploadAvatarToLocal = async function (req: Request, res: Response, next: NextFunction) {
  if (!req.file) return next()
  try {
    // const fileName = `user-${req.user._id}-${Date.now()}.jpeg`
    const fileName = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`src/public/imgs/users/${fileName}`)
    // * because we want store this fileName to DB so we need to pass it like this and then in the update user profile route we will store it to DB
    req.fileName = fileName
    next()
  } catch (err) {
    next(err)
  }
}

const resizeAndUploadAvatarToCloud = async function (req: Request, res: Response, next: NextFunction) {
  if (!req.file) return next()
  try {
    // const fileName = `user-${req.user._id}-${Date.now()}`
    const fileName = `user-${req.user.id}-${Date.now()}`

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
            public_id: `booking-app/images/users/${fileName}`,
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

    next()
  } catch (err) {
    next(err)
  }
}

export default { resizeAndUploadAvatarToLocal, resizeAndUploadAvatarToCloud }
