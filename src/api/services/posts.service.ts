import { Post } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, fetchRandom, removeOne } from './factory.service'
import { IPost } from '../interfaces'
import { IPostInput } from '../interfaces/IPost'

const fetchPosts = fetchAll<IPost>(Post)
const fetchPost = fetchOne<IPost>(Post)
const createPost = createOne<IPost, IPostInput>(Post)
const editPost = editOne<IPost>(Post)
const removePost = removeOne<IPost>(Post)
const fetchRandomPosts = fetchRandom<IPost>(Post)

const updatePostCommentsService = async function (commentId: string, data: any) {
  const newPost = await Post.findOneAndUpdate(
    { 'comments._id': commentId },
    {
      'comments.$.likes': data
    },
    {
      runValidators: true
    }
  )

  return newPost
}

export default { fetchPost, fetchPosts, createPost, editPost, removePost, fetchRandomPosts, updatePostCommentsService }
