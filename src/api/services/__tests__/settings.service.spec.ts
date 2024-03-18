jest.mock('../../database/models/setting.model.ts')
import Setting from '../../database/models/setting.model'
import settingsService from '../settings.service'

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
    it('should return settings', async () => {
      // @ts-ignore
      Setting.find.mockImplementationOnce(() => [settingItem])

      const { data } = await fetchSettings()

      // @ts-ignore
      expect(data).toEqual([settingItem])
    })
  })

  describe('fetchSetting', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Setting.findById.mockImplementationOnce(() => undefined)
        try {
          await fetchSetting('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a setting', async () => {
        // @ts-ignore
        Setting.findById.mockImplementationOnce(() => settingItem)

        const { data } = await fetchSetting('valid_id')
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
        Setting.findByIdAndUpdate.mockImplementationOnce(() => undefined)

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
        Setting.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          await removeSetting('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a setting', async () => {
        // @ts-ignore
        Setting.findByIdAndDelete.mockImplementationOnce(() => settingItem)

        const { data } = await removeSetting('valid_id')
        expect(data).toEqual(settingItem)
      })
    })
  })
})
