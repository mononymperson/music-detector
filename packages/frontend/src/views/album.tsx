import { AlbumInterface, ArtistInterface } from 'common'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getAlbum, getArtist } from '../api/my-server'
import { Container } from '../components/container'
import { HeaderContent } from '../components/header-content'
import { ImageTheme } from '../components/image-theme'
import { Loading } from '../components/loading'
import { Section } from '../components/section'
import { SongItem } from '../components/song-item'

export const Album = () => {
  const arrs = [1, 2, 3, 4, 5]

  const [album, setAlbum] = useState<AlbumInterface>()
  const [artists, setArtists] = useState<ArtistInterface[]>([])

  const params = useParams()

  const fetchArtists = async () => {
    setArtists([])
    album?.artistIds.forEach(async (artistId) => {
      const res = await getArtist(artistId)

      if (res.data) {
        setArtists((arrs) => [
          ...arrs,
          {
            ...(res.data as ArtistInterface),
          },
        ])
      }
    })
  }

  const fetchAlbum = async () => {
    const res = await getAlbum(params.id as string)

    if (res.data) {
      setAlbum(res.data)
    }
  }

  useEffect(() => {
    if (album?.artistIds?.length) {
      fetchArtists()
    }
  }, [album])

  useEffect(() => {
    fetchAlbum()
  }, [])

  if (!album) return <Loading className="h-full flex-1"></Loading>

  return (
    <>
      <HeaderContent>
        <Container className="flex gap-3 mobile:flex-col mobile:items-center">
          <ImageTheme src={album.coverart}></ImageTheme>
          <div className="flex flex-col justify-end items-start">
            <p className="text-2xl">{album.name}</p>
            <div className="flex items-center gap-1">
              {artists.map((artist, i) => (
                <Link to={`/artist/${artist.id}`} key={i}>
                  {artist.name}
                </Link>
              ))}
            </div>
            <p className="text-muted pt-3">
              Realesed on {new Date(album.releaseDate).getFullYear()}
            </p>
          </div>
        </Container>
      </HeaderContent>

      <Container>
        <Section title="Tracks">
          {album.tracks?.map((val, i) => (
            <SongItem
              key={i}
              song={{
                id: val.key,
                title: val.title,
                artist: val.subtitle,
                coverart: val.coverart,
                previewURL: val.previewURL,
              }}
            ></SongItem>
          ))}
        </Section>
      </Container>
    </>
  )
}
