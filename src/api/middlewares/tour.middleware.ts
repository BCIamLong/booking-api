import { NextFunction, Request, Response } from 'express'

const covertJSONStringifyDataToOb = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(req.body['startDates'])
    // console.log(req.body['locations'])
    const newStartDate = JSON.parse(req.body['startLocation'])
    const newStartDates = Array.isArray(req.body['startDates'])
      ? req.body['startDates'].map((date: any) => JSON.parse(date))
      : [JSON.parse(req.body['startDates'])]
    const newLocations = Array.isArray(req.body['locations'])
      ? req.body['locations'].map((loc: any) => JSON.parse(loc))
      : [JSON.parse(req.body['locations'])]

    req.body['startDate'] = newStartDate
    req.body['startDates'] = newStartDates
    req.body['locations'] = newLocations

    next()
  } catch (err) {
    console.log(err)
    next(err)
  }
}

export default { covertJSONStringifyDataToOb }
