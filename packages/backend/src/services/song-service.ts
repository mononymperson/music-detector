import { createFFmpeg } from '@ffmpeg/ffmpeg'
import { readFileSync, unlinkSync } from 'fs'
import path from 'path'

const ffmpeg = createFFmpeg({ log: true })

export const generateShazamSample = async (filename: string) => {
  const fullpath = path.join(__dirname, '../../tmp', filename)

  const sample = readFileSync(fullpath)

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load()
  }

  ffmpeg.FS('writeFile', filename, new Uint8Array(sample.buffer))

  const outputname = new Date() + '.raw'

  await ffmpeg.run(
    '-i',
    filename,
    '-f',
    's16le',
    '-acodec',
    'pcm_s16le',
    '-ac',
    '1',
    '-b:a',
    '16K',
    '-ar',
    '44100',
    outputname
  )
  const data = ffmpeg.FS('readFile', outputname)

  const base64 = Buffer.from(data.buffer).toString('base64')

  unlinkSync(fullpath)

  return base64
}
