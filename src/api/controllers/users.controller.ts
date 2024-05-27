import { usersService, authService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchUsers, fetchUser, editUser, createUser, removeUser } = usersService
const { checkEmailExist } = authService

const getUsers = getAll(async () => {
  const { data, collectionName, count } = await fetchUsers()
  return { data, collectionName, count }
})

const getUser = getOne(async (options) => {
  const { data, collectionName } = await fetchUser(options.id || '')
  return { data, collectionName }
})

const postUser = postOne(async (options) => {
  await checkEmailExist('user', options.body.email)
  const { data, collectionName } = await createUser(options.body || {})

  return { data, collectionName }
})

const updateUser = updateOne(async (options) => {
  const { data, collectionName } = await editUser(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteUser = deleteOne(async (options) => {
  const { data, collectionName } = await removeUser(options)
  // const { data, collectionName } = await removeUser(options.id || '')

  return { data, collectionName }
})

export default { getUsers, getUser, postUser, updateUser, deleteUser }
