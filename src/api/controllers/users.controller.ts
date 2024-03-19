import { usersService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchUsers, fetchUser, editUser, createUser, removeUser } = usersService

const getUsers = getAll(async () => {
  const { data, collectionName } = await fetchUsers()
  return { data, collectionName }
})

const getUser = getOne(async (options) => {
  const { data, collectionName } = await fetchUser(options.id || '')
  return { data, collectionName }
})

const postUser = postOne(async (options) => {
  const { data, collectionName } = await createUser(options.body || {})

  return { data, collectionName }
})

const updateUser = updateOne(async (options) => {
  const { data, collectionName } = await editUser(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteUser = deleteOne(async (options) => {
  const { data, collectionName } = await removeUser(options.id || '')

  return { data, collectionName }
})

export default { getUsers, getUser, postUser, updateUser, deleteUser }
