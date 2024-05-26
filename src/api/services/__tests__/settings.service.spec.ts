jest.mock('../../database/models/setting.model.ts')
// jest.mock('../settings.service.ts')
jest.mock('../../utils/index.ts')
// jest.mock('../../utils/APIFeatures.ts')
jest.mock('../../utils/APIFeatures.ts', () => {
  return jest.fn().mockImplementation(() => {
    return {
      filter: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      selectFields: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis()
      // !when we mock class we doesn't need to mock properties on the constructor, but we can mock the properties before we pass these to the constructor
      // query: jest.fn().mockResolvedValue(['item1'])
    }
  })
})

import APIFeatures from '../../utils/APIFeatures'
import { AppError } from '../../utils'
import Setting from '../../database/models/setting.model'
import settingsService from '../settings.service'
import APIFeaturesMock from './__mocks__/APIFeaturesMock'

const { fetchSettings, fetchSetting, createSetting, editSetting, removeSetting } = settingsService

const settingItem = {
  _id: 'f10e695b-14df-4fe0-a944-fcf8e473e614',
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPersonal: 5,
  breakfastPrice: 10,
  createdAt: new Date(),
  updatedAt: new Date()
}

const settingInput = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPersonal: 5,
  breakfastPrice: 10
}

describe('unit test for settings service', () => {
  describe('fetchSettings', () => {
    describe('fetch settings data with no query string', () => {
      it('should return settings', async () => {
        // @ts-ignore
        // APIFeatures.mockImplementationOnce(() => APIFeaturesMock)
        // APIFeatures = jest.fn().mockImplementation(() => {
        //   return {
        //     // !when we mock class we doesn't need to mock properties on the constructor, but we can mock the properties before we pass these to the constructor
        //     // query: Promise.resolve(['item1']),
        //     filter: jest.fn().mockReturnThis(),
        //     sort: jest.fn().mockReturnThis(),
        //     selectFields: jest.fn().mockReturnThis(),
        //     pagination: jest.fn().mockReturnThis()
        //   }
        // })

        // APIFeatures.prototype.query = Promise.resolve(['item1'])
        // APIFeatures.prototype.filter = jest.fn().mockReturnThis()
        // APIFeatures.prototype.sort = jest.fn().mockReturnThis()
        // APIFeatures.prototype.selectFields = jest.fn().mockReturnThis()
        // APIFeatures.prototype.pagination = jest.fn().mockResolvedValue({
        //   query: Promise.resolve(['item1'])
        // })
        // @ts-ignore

        // @ts-ignore
        Setting.find.mockResolvedValue([settingItem])

        const data = await fetchSettings()
        // console.log(data)
        expect(data.data).toEqual([settingItem])
      })
    })

    describe('fetch settings data with sort query string', () => {
      it('should return the settings with sort ordered', async () => {
        // @ts-ignore
        // APIFeatures.mockImplementation(() => {
        //   return {
        //     // !when we mock class we doesn't need to mock properties on the constructor, but we can mock the properties before we pass these to the constructor
        //     // query: Promise.resolve(['item1']),
        //     filter: jest.fn().mockReturnThis(),
        //     sort: jest.fn().mockReturnThis(),
        //     selectFields: jest.fn().mockReturnThis(),
        //     pagination: jest.fn().mockReturnThis()
        //   }
        // })
        // APIFeatures.prototype.filter = jest.fn().mockReturnThis()
        // APIFeatures.prototype.sort = jest.fn().mockReturnThis()
        // APIFeatures.prototype.selectFields = jest.fn().mockReturnThis()
        // APIFeatures.prototype.pagination = jest.fn().mockResolvedValue({
        //   query: Promise.resolve(['item1'])
        // })
        // @ts-ignore
        // Setting.find.mockResolvedValue([settingItem])
        // const { data } = await fetchSettings({ sort: 'maxGuestsPersonal' })
        // expect(data).toEqual([settingItem])
      })
    })
  })

  describe('fetchSetting', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Setting.findById.mockReturnValueOnce(undefined)
        // @ts-ignore
        Setting.findById.mockRejectedValueOnce({
          statusCode: 404
        })
        try {
          await fetchSetting('invalid_id')
        } catch (err: any) {
          // console.log(err)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a setting', async () => {
        // @ts-ignore
        Setting.findById.mockImplementationOnce(() => settingItem)

        // @ts-ignore
        const { data } = (await fetchSetting('valid_id')) || {}
        expect(data).toEqual(settingItem)
      })
    })
  })

  describe('createSetting', () => {
    describe('given an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Setting.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await createSetting(settingInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a new setting', async () => {
        // @ts-ignore
        Setting.create.mockImplementationOnce(() => settingItem)

        const { data } = await createSetting(settingInput)

        expect(data).toEqual(settingItem)
      })
    })
  })

  describe('editSetting', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Setting.findByIdAndUpdate.mockImplementationOnce(() => undefined)
        // @ts-ignore
        Setting.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 404
        })

        try {
          await editSetting('invalid_id', settingInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id but an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Setting.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await editSetting('valid_id', settingInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid id and a valid input', () => {
      it('should return a new updated setting', async () => {
        // @ts-ignore
        Setting.create.mockImplementationOnce(() => settingItem)

        const { data } = await createSetting(settingInput)

        expect(data).toEqual(settingItem)
      })
    })
  })

  describe('removeSetting', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Setting.findByIdAndDelete.mockImplementationOnce(() => undefined)
        // @ts-ignore
        Setting.findOneAndDelete.mockRejectedValueOnce({
          statusCode: 404
        })
        try {
          // @ts-ignore
          await removeSetting({ id: 'invalid_id' })
        } catch (err: any) {
          // console.log(err)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a setting', async () => {
        // @ts-ignore
        Setting.findOneAndDelete.mockImplementationOnce(() => settingItem)
        // @ts-ignore
        const { data } = await removeSetting({ id: 'valid_id' })
        expect(data).toEqual(settingItem)
      })
    })
  })
})
