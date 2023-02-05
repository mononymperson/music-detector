import { Request, Router } from 'express'

import { getAlbum } from '../api/shazam-api'
import { JSONResponse } from '../interfaces'

const router = Router()

export const AlbumRouter = () => {
  router.get(
    '/show/:id',
    async (req: Request, res: JSONResponse<any>) => {
      try {
        return res.json({
          data: await getAlbum(req.params.id),
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
