import * as fs from 'fs'
import 'dotenv/config'
import mongoose from 'mongoose'
import { Guest } from '~/api/database/models'
import { dbConfig } from '~/config'

const { DB_LOCAL } = dbConfig

const guestsData = JSON.parse(fs.readFileSync('src/data/guests.json', 'utf-8'))
;(async () => {
  try {
    await mongoose.connect(DB_LOCAL!)
  } catch (err) {
    console.log(err)
  }
})()

const importData = async function (Model: any, data: any) {
  try {
    await Model.insertMany(data)
    console.log('Import data success')
  } catch (err: any) {
    console.log(err)
  }
}

if (process.argv[2] === '--guests') importData(Guest, guestsData)
