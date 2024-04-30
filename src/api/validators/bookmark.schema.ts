import Joi from 'joi'

const createBookmarkSchema = Joi.object({
  user: Joi.string().uuid().required(),
  cabin: Joi.string().uuid().required(),
  link: Joi.string().required()
})

const updateBookmarkSchema = Joi.object({
  link: Joi.string()
})

export default { createBookmarkSchema, updateBookmarkSchema }
