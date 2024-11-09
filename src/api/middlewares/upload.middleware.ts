// * because sharp cause some problem on deployment and we also use the resizeAndUploadAvatarToLocal so we can just ignore them but of course we can use it in local
// * for now in development just delete it and if we need we just use this code again
// import sharp from 'sharp'
import { UploadApiResponse } from 'cloudinary'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { uploadConfig } from '~/config'

const { cloudinary } = uploadConfig

// const resizeAndUploadAvatarToLocal = async function (req: Request, res: Response, next: NextFunction) {
//   if (!req.file) return next()
//   try {
//     // const fileName = `user-${req.user._id}-${Date.now()}.jpeg`
//     const fileName = `user-${req.user.id}-${Date.now()}.jpeg`

//     await sharp(req.file.buffer)
//       .resize(300, 300)
//       .toFormat('jpeg')
//       .jpeg({ quality: 90 })
//       .toFile(`src/public/imgs/users/${fileName}`)
//     // * because we want store this fileName to DB so we need to pass it like this and then in the update user profile route we will store it to DB
//     req.fileName = fileName
//     next()
//   } catch (err) {
//     next(err)
//   }
// }

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

const resizeImage = async function ({ fileBuffer, imageName }: { fileBuffer: any; imageName: any }) {
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
          filename_override: imageName,
          public_id: `booking-app/images/tours/${imageName}`,
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
      .end(fileBuffer)
  })

  // console.log(data)
  // * store the secure url from data to req.fileName which is what we will store to DB later
  return data.secure_url
}

const resizeAndUploadTourImagesToCloud = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(req.files)
    // console.log(req.files)
    const imageCoverFile = (req.files as any)?.imageCover?.[0]
    const imagesFiles = (req.files as any)?.images
    // console.log(imageCoverFile, imagesFiles)
    if (!imageCoverFile && !imagesFiles) return next()
    if (imageCoverFile) {
      const imageCoverName = `tour-cover-${uuidv4()}}`

      const imageCoverUrl = await resizeImage({
        fileBuffer: imageCoverFile?.buffer,
        imageName: imageCoverName
      })

      req.body['imageCover'] = imageCoverUrl
    }

    // const fileName = `user-${req.user._id}-${Date.now()}`
    if (imagesFiles) {
      const imagesQueryObArr = imagesFiles.map((image: any) => {
        const imageName = `tour-${uuidv4()}}`
        return resizeImage({
          fileBuffer: image?.buffer,
          imageName: imageName
        })
      })
      const imagesUrlArr = await Promise.all(imagesQueryObArr)

      req.body['images'] = imagesUrlArr
    }
    next()
  } catch (err) {
    next(err)
  }
}

const resizeAndUploadGuestAvatarToCloud = async function (req: Request, res: Response, next: NextFunction) {
  if (!req.file) return next()
  try {
    // const fileName = `user-${req.user._id}-${Date.now()}`
    const fileName = `guest-${req.user.id}-${Date.now()}`

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
    req.body['avatar'] = data.secure_url

    next()
  } catch (err) {
    next(err)
  }
}

export default { resizeAndUploadAvatarToCloud, resizeAndUploadTourImagesToCloud, resizeAndUploadGuestAvatarToCloud }
// export default { resizeAndUploadAvatarToLocal, resizeAndUploadAvatarToCloud }
