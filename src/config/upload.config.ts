import { v2 as cloudinary } from 'cloudinary'
import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { AppError } from '~/api/utils'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const multerStorage = multer.memoryStorage()

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) return cb(null, true)

  cb(null, false)
  throw new AppError(400, 'Please only upload the image file!')
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

export default { upload, cloudinary }
