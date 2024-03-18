import { settingsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchSettings, fetchSetting, editSetting, createSetting, removeSetting } = settingsService

const getSettings = getAll(async () => {
  const { data, collectionName } = await fetchSettings()
  return { data, collectionName }
})

const getSetting = getOne(async (options) => {
  const { data, collectionName } = await fetchSetting(options.id || '')
  return { data, collectionName }
})

const postSetting = postOne(async (options) => {
  const { data, collectionName } = await createSetting(options.body || {})

  return { data, collectionName }
})

const updateSetting = updateOne(async (options) => {
  const { data, collectionName } = await editSetting(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteSetting = deleteOne(async (options) => {
  const { data, collectionName } = await removeSetting(options.id || '')

  return { data, collectionName }
})

export default { getSettings, getSetting, postSetting, updateSetting, deleteSetting }
