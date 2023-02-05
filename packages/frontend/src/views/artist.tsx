import { ArtistInterface } from 'common'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { getArtist } from '../api/my-server'
import { AlbumItem } from '../components/album-item'
import { Container } from '../components/container'
import { Grid } from '../components/grid'
import { HeaderContent } from '../components/header-content'
import { ImageTheme } from '../components/image-theme'
import { Loading } from '../components/loading'
import { Section } from '../components/section'
import { SongItem } from '../components/song-item'

export const Artist = () => {
  const [artist, setArtist] = useState<ArtistInterface>()

  const params = useParams()

  const fetchArtist = async () => {
    const res = await getArtist(params.id as string)

    if (res.data) {
      setArtist(res.data)
    }
  }

  useEffect(() => {
    fetchArtist()
  }, [])

  if (!artist) return <Loading className="h-full flex-1"></Loading>

  return (
    <>
      <HeaderContent>
        <Container className="flex gap-3 flex-col items-center">
          <ImageTheme src={artist.picture}></ImageTheme>
          <p className="text-2xl">{artist.name}</p>
        </Container>
      </HeaderContent>

      <Container>
        <Section title="Top songs">
          {artist.topSongs.map((val) => (
            <SongItem
              key={val.key}
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

        <Section title="Albums">
          <Grid>
            {artist.albums.map((val) => (
              <AlbumItem
                key={val.id}
                album={{
                  id: val.id,
                  title: val.name,
                  src: val.coverart,
                }}
              ></AlbumItem>
            ))}
          </Grid>
        </Section>
      </Container>
    </>
  )
}
