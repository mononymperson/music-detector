import { ArtistInterface, SongInterface } from 'common'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { search } from '../api/my-server'
import { ArtistItem } from '../components/artist-item'
import { Container } from '../components/container'
import { Grid } from '../components/grid'
import { Loading } from '../components/loading'
import { Section } from '../components/section'
import { SongItem } from '../components/song-item'

export const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [query, _] = useSearchParams()

  const [songs, setSongs] = useState<SongInterface[]>([])
  const [artists, setArtists] = useState<ArtistInterface[]>([])

  const [onSearch, setOnSearch] = useState(false)
  const onSearchRef = useRef(false)
  const page = useRef(1)

  const fetchSearch = async () => {
    onSearchRef.current = true
    setOnSearch(true)

    const { data } = await search(query.get('keyword') as string, page.current)

    onSearchRef.current = false
    setOnSearch(false)

    setSongs((song) => [...song, ...(data?.tracks ?? [])])
    setArtists((artist) => [...artist, ...(data?.artists ?? [])])
  }

  const filterButtons = ['All', 'Songs', 'Artists']

  const [selectedFilter, setSelectedFilter] = useState(0)

  const onWindowScroll = () => {
    if (onSearchRef.current) return

    if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
      page.current++
      fetchSearch()
    }
  }

  useEffect(() => {
    if (selectedFilter == 0) {
      window.removeEventListener('scroll', onWindowScroll)
      fetchSearch()
    } else {
      page.current++
      fetchSearch()
      window.addEventListener('scroll', onWindowScroll)
    }
  }, [selectedFilter])

  useEffect(() => {
    if (!query.get('keyword')) {
      navigate('/')
    } else {
      setSelectedFilter(0)
    }
  }, [location])

  return selectedFilter === 0 && onSearch ? (
    <Loading className="h-full flex-1"></Loading>
  ) : (
    <Container>
      <p className="text-2xl mb-5">
        Search result for <i>{query.get('keyword')}</i>
      </p>

      {!artists.length && !songs.length ? (
        <p className="text-center my-5">DATA NOT FOUND</p>
      ) : (
        <>
          <Section>
            <div className="flex items-center gap-5">
              {filterButtons.map((filter, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFilter(i)}
                  className={`px-3 py-1.5 text-lg rounded-lg ${
                    selectedFilter === i ? 'bg-primary' : 'bg-component'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Songs" hide={selectedFilter === 2}>
            {songs.map((val, i) => (
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
            {selectedFilter === 1 && onSearch ? <Loading></Loading> : ''}
          </Section>

          <Section title="Artists" hide={selectedFilter === 1}>
            <Grid>
              {artists.map((val, i) => (
                <ArtistItem
                  key={i}
                  artist={{
                    id: val.id,
                    src: val.picture,
                    name: val.name,
                  }}
                ></ArtistItem>
              ))}
            </Grid>
            {selectedFilter === 2 && onSearch ? <Loading></Loading> : ''}
          </Section>
        </>
      )}
    </Container>
  )
}
