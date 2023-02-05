import { Request, Router } from 'express'
import multer from 'multer'

import { detectSong, getRecommendations, getSong } from '../api/shazam-api'
import { JSONResponse } from '../interfaces'
import { generateShazamSample } from '../services/song-service'

const router = Router()

export const SongRouter = () => {
  const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        callback(null, './tmp')
      },
      filename(req, file, callback) {
        let extArray = file.mimetype.split('/')
        let extension = extArray[extArray.length - 1]
        callback(null, file.fieldname + '-' + Date.now() + '.' + extension)
      },
    }),
  })

  router.post(
    '/detect',
    upload.single('sample'),
    async (req: Request, res: JSONResponse<any>) => {
      try {
        const data = await detectSong(
          await generateShazamSample(req.file?.filename as string)
        )

        return res.json({
          data,
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
    '/show/:key',
    async (req: Request, res: JSONResponse<any>) => {
      try {
        return res.json({
          data: await getSong(req.params.key),
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
    '/recommendations/:key',
    async (req: Request, res: JSONResponse<any>) => {
      try {
        return res.json({
          data: await getRecommendations(req.params.key),
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
