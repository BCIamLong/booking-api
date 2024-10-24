import { postsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchPosts, fetchPost, editPost, createPost, removePost } = postsService

const getPosts = getAll(async (options) => {
  const { data, collectionName, count } = await fetchPosts(options.queryStr!)
  return { data, collectionName, count }
})

const getPost = getOne(async (options) => {
  console.log(options)
  const { data, collectionName } = await fetchPost(options.id || '')
  return { data, collectionName }
})

const postPost = postOne(async (options) => {
  const { data, collectionName } = await createPost(options.body || {})

  return { data, collectionName }
})

const updatePost = updateOne(async (options) => {
  const { data, collectionName } = await editPost(options.id || '', options.body || {})

  return { data, collectionName }
})

const deletePost = deleteOne(async (options) => {
  const { data, collectionName } = await removePost(options)
  // const { data, collectionName } = await removePost(options.id || '')

  return { data, collectionName }
})

export default { getPosts, getPost, postPost, updatePost, deletePost }
