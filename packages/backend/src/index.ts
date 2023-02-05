import cors from 'cors'
import express from 'express'

import { IndexRouter } from './routers'
import { AlbumRouter } from './routers/album'
import { ArtistRouter } from './routers/artist'
import { SongRouter } from './routers/song'

require('dotenv').config()

const app = express()

app.use(cors())

app.use('/', IndexRouter())
app.use('/song', SongRouter())
app.use('/artist', ArtistRouter())
app.use('/album', AlbumRouter())

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`)
})
