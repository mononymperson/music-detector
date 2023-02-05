import { Request, Router } from 'express'

import { search } from '../api/shazam-api'
import { JSONResponse } from '../interfaces'

const router = Router()

export const IndexRouter = () => {
  router.get(
    '/search/:keyword',
    async (
      req: Request<
        any,
        any,
        any,
        {
          page: number
          limit: number
        },
        any
      >,
      res: JSONResponse<any>
    ) => {
      try {
        return res.json({
          data: await search(
            req.params.keyword,
            req.query.page
          ),
          message: 'success',
          status: 200,
        })
      } catch (error) {
        return res.status(400).json({
          data: null,
          message: (error as Error).message,
          status: 400,
        })
      }
    }
  )

  return router
}
