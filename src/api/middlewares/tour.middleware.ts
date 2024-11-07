import { NextFunction, Request, Response } from 'express'

const covertJSONStringifyDataToOb = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(req.body)
    if (req.body['startLocation']) {
      const newStartLocation = JSON.parse(req.body['startLocation'])
      req.body['startLocation'] = newStartLocation
    }
    if (req.body['startDates']) {
      const newStartDates = Array.isArray(req.body['startDates'])
        ? req.body['startDates'].map((date: any) => JSON.parse(date))
        : [JSON.parse(req.body['startDates'])]
      req.body['startDates'] = newStartDates
    }
    if (req.body['locations']) {
      const newLocations = Array.isArray(req.body['locations'])
        ? req.body['locations'].map((loc: any) => JSON.parse(loc))
        : [JSON.parse(req.body['locations'])]

      req.body['locations'] = newLocations
    }
    // console.log(req.body['startDates'])
    // console.log(req.body['locations'])

    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export default { covertJSONStringifyDataToOb }
