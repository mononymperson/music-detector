import { ArtistInterface, SongInterface } from 'common'
import { useEffect, useState } from 'react'
import { IoIosPause, IoIosPlay } from 'react-icons/io'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { getArtist, getRecommendations, getSong } from '../api/my-server'
import { Container } from '../components/container'
import { HeaderContent } from '../components/header-content'
import { Icon } from '../components/icon'
import { ImageTheme } from '../components/image-theme'
import { Loading } from '../components/loading'
import { Lyrics } from '../components/lyrics'
import { Section } from '../components/section'
import { SongItem } from '../components/song-item'
import { useGlobalContext } from '../contexts/global-context'

export const Track = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const params = useParams()
  const globalContext = useGlobalContext()

  const [song, setSong] = useState<SongInterface>()
  const [artists, setArtists] = useState<ArtistInterface[]>([])
  const [recommendations, setRecommendations] = useState<SongInterface[]>([])

  const previewSong = () => {
    globalContext.togglePlayAudio(song?.previewURL as string)
  }

  const fetchRecommendations = async () => {
    setRecommendations([])

    if (!song?.key) return

    setRecommendations((await getRecommendations(song?.key)).data ?? [])
  }

  const fetchArtists = async () => {
    setArtists([])
    if (song?.artistIds) {
      song?.artistIds.forEach(async (artistId) => {
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
    } else {
      setArtists([
        {
          id: '',
          name: song?.subtitle as string,
          albums: [],
          picture: '',
          topSongs: [],
        },
      ])
    }
  }

  const fetchSong = () => {
    getSong(params.id as string)
      .then(({ data }) => setSong(data as SongInterface))
      .catch(() => navigate('/'))
  }

  useEffect(() => {
    if (song?.key) {
      fetchArtists()
      fetchRecommendations()
    } else {
      fetchSong()
    }
  }, [song])

  useEffect(() => {
    setSong(undefined)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location])

  if (!song) return <Loading className="h-full flex-1"></Loading>

  return (
    <>
      {/* header content */}
      <HeaderContent>
        <Container className="flex gap-3 mobile:flex-col mobile:items-center">
          <ImageTheme src={song.coverart}></ImageTheme>
          <div className="flex flex-col justify-end items-start">
            <p className="text-2xl">{song.title}</p>
            <div className="flex items-center gap-1">
              {artists.map((artist, i) =>
                artist.id ? (
                  <Link to={`/artist/${artist.id}`} key={i}>
                    {artist.name}
                  </Link>
                ) : (
                  <p key={i}>{artist.name}</p>
                )
              )}
            </div>
            {song.previewURL ? (
              <button
                onClick={() => previewSong()}
                title="preview song"
                className="mt-3 px-3 py-1.5 rounded-lg border border-primary flex items-center gap-1.5"
              >
                {globalContext.onPlayingAudio(
                  song.previewURL,
                  <IoIosPause size={18}></IoIosPause>,
                  <IoIosPlay size={18}></IoIosPlay>
                )}
                <span>Preview song</span>
              </button>
            ) : (
              ''
            )}
          </div>
        </Container>
      </HeaderContent>

      <Container>
        <div className="flex gap-3">
          {/* open on */}
          <Section title="Open on" className="flex-1 flex flex-col gap-3.5">
            {song.providers.map((provider, i) => (
              <a
                className="flex items-center gap-5"
                key={i}
                href={provider.link}
                target="_blank"
              >
                <Icon name={provider.type}></Icon>
                {provider.name}
              </a>
            ))}
          </Section>
          {/* lyrics */}
          <Section title="Lyrics" className="flex-1">
            <Lyrics
              footer={song.lyrics.footer}
              lyrics={song.lyrics.text}
            ></Lyrics>
          </Section>
        </div>

        {/* recommendations */}
        <Section title="Recommendations" hide={!recommendations.length}>
          {recommendations.map((val, i) => (
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
