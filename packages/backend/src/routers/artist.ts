import { Request, Router } from 'express'

import { getArtist, getTopSongs } from '../api/shazam-api'
import { JSONResponse } from '../interfaces'

const router = Router()

export const ArtistRouter = () => {
  router.get(
    '/show/:id',
    async (req: Request, res: JSONResponse<any>) => {
      try {
        return res.json({
          data: await getArtist(req.params.id),
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

  router.get(
    '/top-songs/:id',
    async (req: Request, res: JSONResponse<any>) => {
      try {
        return res.json({
          data: await getTopSongs(req.params.id),
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
