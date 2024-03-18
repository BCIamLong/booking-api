import { Router } from 'express'
import { asyncCatch } from '../utils'
import { settingsController } from '../controllers'

const { getSettings, getSetting, postSetting, updateSetting, deleteSetting } = settingsController

const settingsRouter = Router()

settingsRouter
  .route('/')
  /**
   * @openapi
   * '/api/v1/settings':
   *  get:
   *   tags:
   *   - Setting
   *   summary: get all settings
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           settings:
   *            type: array
   *            items:
   *             $ref: '#/components/schemas/SettingResponse'
   *    404:
   *     description: Not found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getSettings))
  /**
   * @openapi
   * '/api/v1/settings':
   *  post:
   *   tags:
   *   - Setting
   *   summary: create setting
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/CreateSettingInput'
   *   responses:
   *    201:
   *     description: Success create new data
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           setting:
   *            $ref: '#/components/schemas/SettingResponse'
   *
   *    400:
   *     description: Bad request
   *    500:
   *     description: Something went wrong
   *
   *
   */
  .post(asyncCatch(postSetting))
settingsRouter

  .route('/:id')
  /**
   * @openapi
   * '/api/v1/settings/{id}':
   *  get:
   *   tags:
   *   - Setting
   *   summary: get a setting with setting id
   *   parameters:
   *    - name: id
   *      in: path
   *      description: the id of the setting
   *      required: true
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        $ref: '#/components/schemas/SettingResponse'
   *    404:
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   */
  .get(asyncCatch(getSetting))
  /**
   * @openapi
   * '/api/v1/settings/{id}':
   *  patch:
   *   tags:
   *   - Setting
   *   summary: update an setting with the setting id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the setting
   *     required: true
   *   requestBody:
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#components/schemas/UpdateSettingInput'
   *   responses:
   *    200:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: object
   *          properties:
   *           setting:
   *            $ref: '#components/schemas/SettingResponse'
   *    400:
   *     description: Bad request
   *    404:
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   */
  .patch(asyncCatch(updateSetting))
  /**
   * @openapi
   * '/api/v1/settings/{id}':
   *  delete:
   *   tags:
   *   - Setting
   *   summary: delete a setting with the setting id
   *   parameters:
   *   - name: id
   *     in: path
   *     description: the id of the setting
   *     required: true
   *   responses:
   *    204:
   *     description: Success
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         data:
   *          type: null
   *    404:
   *     description: No setting found
   *    500:
   *     description: Something went wrong
   */
  .delete(asyncCatch(deleteSetting))

export default settingsRouter
