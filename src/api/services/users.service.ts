import { IUser } from '../interfaces'
import { User } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'

const fetchUsers = fetchAll<IUser>(User)
const fetchUser = fetchOne<IUser>(User)
const createUser = createOne<IUser>(User)
const editUser = editOne<IUser>(User)
const removeUser = removeOne<IUser>(User)

export default { fetchUser, fetchUsers, createUser, editUser, removeUser }
