import Joi from 'joi'
/**
 * @openapi
 * components:
 *  schemas:
 *   CreatePostInput:
 *    type: object
 *    required:
 *     - tourId
 *     - userId
 *     - title
 *     - description
 *     - images
 *    properties:
 *     tourId:
 *      type: string
 *      default: 12345
 *      description: The ID of the tour associated with the post.
 *     userId:
 *      type: string
 *      default: 67890
 *      description: The ID of the user creating the post.
 *     title:
 *      type: string
 *      default: My Amazing Tour Experience
 *      description: The title of the post.
 *     description:
 *      type: string
 *      default: I had a wonderful time at this tour! Highly recommended.
 *      description: A detailed description of the user's experience.
 *     images:
 *      type: array
 *      items:
 *       type: string
 *       format: binary
 *      description: A list of image file names associated with the post.
 */
const createPostSchema = Joi.object({
  tourId: Joi.string().required(),
  userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdatePostInput:
 *    type: object
 *    properties:
 *     title:
 *      type: string
 *      description: The updated title of the post.
 *      default: Updated Amazing Tour Experience
 *     description:
 *      type: string
 *      description: The updated description of the post.
 *      default: Updated detailed description of the amazing tour experience.
 *     images:
 *      type: array
 *      items:
 *       type: string
 *      description: The updated list of image file names associated with the post.
 *      default: ["updated_image1.jpg", "updated_image2.jpg"]
 *     likes:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        _id:
 *         type: string
 *         description: The ID of the like.
 *         default: "like123"
 *        userId:
 *         type: string
 *         description: The ID of the user who liked the post.
 *         default: "user456"
 *        likeAt:
 *         type: string
 *         description: The timestamp when the like was added.
 *         default: "2025-01-21T12:00:00Z"
 *     comments:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        _id:
 *         type: string
 *         description: The ID of the comment.
 *         default: "comment123"
 *        userId:
 *         type: string
 *         description: The ID of the user who commented.
 *         default: "user789"
 *        likes:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            description: The ID of the like on the comment.
 *            default: "like456"
 *           userId:
 *            type: string
 *            description: The ID of the user who liked the comment.
 *            default: "user123"
 *           likeAt:
 *            type: string
 *            description: The timestamp when the like was added.
 *            default: "2025-01-21T12:10:00Z"
 *        content:
 *         type: string
 *         description: The content of the comment.
 *         default: "This is an updated comment."
 *        commentAt:
 *         type: string
 *         description: The timestamp when the comment was added.
 *         default: "2025-01-21T11:30:00Z"
 *        updateCommentAt:
 *         type: string
 *         description: The timestamp when the comment was last updated.
 *         default: "2025-01-21T12:30:00Z"
 *     shares:
 *      type: number
 *      description: The updated number of shares for the post.
 *      default: 42
 *     bookmarks:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        _id:
 *         type: string
 *         description: The ID of the bookmark.
 *         default: "bookmark123"
 *        userId:
 *         type: string
 *         description: The ID of the user who bookmarked the post.
 *         default: "user456"
 *        bookmarkAt:
 *         type: string
 *         description: The timestamp when the bookmark was added.
 *         default: "2025-01-21T12:45:00Z"
 */
const updatePostSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  images: Joi.array().items(Joi.string()),
  likes: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      userId: Joi.string(),
      likeAt: Joi.string()
    })
  ),
  comments: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      userId: Joi.string(),
      likes: Joi.array().items(
        Joi.object({
          _id: Joi.string(),
          userId: Joi.string(),
          likeAt: Joi.string()
        })
      ),
      content: Joi.string(),
      commentAt: Joi.string(),
      updateCommentAt: Joi.string()
    })
  ),
  shares: Joi.number(),
  bookmarks: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      userId: Joi.string(),
      bookmarkAt: Joi.string()
    })
  )
})

export default { createPostSchema, updatePostSchema }
