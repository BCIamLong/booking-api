jest.mock('../../database/models/setting.model.ts')
jest.mock('../../utils/index.ts')
jest.mock('../../services/settings.service')

import Setting from '../../database/models/setting.model'
import settingsController from '../settings.controller'
import settingsService from '../../services/settings.service'

const { getSettings, getSetting, postSetting, deleteSetting, updateSetting } = settingsController

const req = {
  params: {
    id: 123
  },
  body: {}
}

// const res1 = {
//   json: jest.fn((x) => x)
// }

const res = {
  status: jest.fn().mockReturnThis(),
  // status: jest.fn((status: number) => res1),
  json: jest.fn((x) => x)
}
// const res = jest

const settingItem = {
  _id: 'f10e695b-14df-4fe0-a944-fcf8e473e614',
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPersonal: 5,
  breakfastPrice: 10,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('unit test for settings controller', () => {
  describe('test getSettings function', () => {
    it('should return a status of 200 and settings list', async () => {
      // @ts-ignore
      // Setting.find.mockResolvedValue([settingItem])
      // Setting.find.mockImplementationOnce(() => [settingItem])

      jest.spyOn(settingsService, 'fetchSettings').mockImplementationOnce(() => ({
        data: [settingItem],
        collectionName: 'settings',
        count: 1
      }))

      // @ts-ignore
      await getSettings(req, res)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Object),
        count: 1,
        results: 1
      })
    })
  })

  describe('test getSetting function', () => {
    describe('given an invalid setting id ', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(settingsService, 'fetchSetting').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Setting.findById.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await getSetting(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given an valid setting id ', () => {
      it('should return a status of 200 and setting', async () => {
        // @ts-ignore
        // Setting.findById.mockImplementationOnce(() => settingItem)
        jest.spyOn(settingsService, 'fetchSetting').mockImplementationOnce(() => ({
          data: settingItem,
          collectionName: 'settings'
        }))

        // @ts-ignore
        await getSetting(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            setting: settingItem
          }
        })
      })
    })
  })

  describe('test updateSetting function', () => {
    describe('given the invalid setting id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(settingsService, 'editSetting').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Setting.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await updateSetting(req, res)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
          expect(res.json).toHaveBeenCalledTimes(0)
        }
      })
    })

    describe('given the invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(settingsService, 'editSetting').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        // @ts-ignore
        // Setting.findByIdAndUpdate.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await updateSetting(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a status of 200 and new updated setting', async () => {
        // @ts-ignore
        jest.spyOn(settingsService, 'editSetting').mockImplementationOnce(() => ({
          data: settingItem,
          collectionName: 'settings'
        }))

        // @ts-ignore
        // Setting.findByIdAndUpdate.mockImplementationOnce(() => settingItem)

        // @ts-ignore
        await updateSetting(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            setting: settingItem
          }
        })
      })
    })
  })

  describe('test postSetting function', () => {
    describe('given an invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(settingsService, 'createSetting').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // @ts-ignore
        // Setting.create.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await postSetting(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a status of 201 and new setting', async () => {
        // @ts-ignore
        jest.spyOn(settingsService, 'createSetting').mockImplementationOnce(() => ({
          data: settingItem,
          collectionName: 'settings'
        }))
        // @ts-ignore
        // Setting.create.mockImplementationOnce(() => settingItem)

        // @ts-ignore
        await postSetting(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            // setting: expect.any(Object)
            setting: settingItem
          }
        })
      })
    })
  })

  describe('test deleteSetting function', () => {
    describe('given an invalid id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(settingsService, 'removeSetting').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Setting.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          // @ts-ignore
          await deleteSetting(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a status of 204', async () => {
        // @ts-ignore
        jest.spyOn(settingsService, 'removeSetting').mockImplementationOnce(() => ({
          data: settingItem,
          collectionName: 'settings'
        }))
        // Setting.findByIdAndDelete.mockImplementationOnce(() => settingItem)

        // @ts-ignore
        await deleteSetting(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null })
      })
    })
  })
})
