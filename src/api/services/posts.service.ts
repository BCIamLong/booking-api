import { Post } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { IPost } from '../interfaces'
import { IPostInput } from '../interfaces/IPost'

const fetchPosts = fetchAll<IPost>(Post)
const fetchPost = fetchOne<IPost>(Post)
const createPost = createOne<IPost, IPostInput>(Post)
const editPost = editOne<IPost>(Post)
const removePost = removeOne<IPost>(Post)

export default { fetchPost, fetchPosts, createPost, editPost, removePost }
