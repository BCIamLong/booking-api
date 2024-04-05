import { ISetting } from '../interfaces'
import { Setting } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { ISettingInput } from '../interfaces/ISetting'

const fetchSettings = fetchAll<ISetting>(Setting)
const fetchSetting = fetchOne<ISetting>(Setting)
const createSetting = createOne<ISetting, ISettingInput>(Setting)
const editSetting = editOne<ISetting>(Setting)
const removeSetting = removeOne<ISetting>(Setting)

export default { fetchSetting, fetchSettings, createSetting, editSetting, removeSetting }
