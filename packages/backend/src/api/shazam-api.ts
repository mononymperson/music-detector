import axios, { AxiosResponse } from 'axios'
import { AlbumInterface, ArtistInterface, Provider, SearchResult, SongInterface } from 'common'

require('dotenv').config()

const axiosClient = axios.create({
  baseURL: process.env.RAPID_API_URL,
})

axiosClient.interceptors.request.use((config: any) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': process.env.RAPID_API_HOST,
    },
  }
})

/**
 *
 * @param sample
 * @return {String} key of song
 */
export const detectSong = async (sample: string): Promise<string> => {
  const { data } = await axiosClient.post('/songs/v2/detect', sample, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })

  return data?.track?.key
}

const findLyrics = (sections: any[]) => {
  const found = sections.find((data) => data.type === 'LYRICS')

  if (found) {
    return {
      text: found.text,
      footer: found.footer,
    } satisfies SongInterface['lyrics']
  }

  return {}
}

const findSpotifyProvider = (hub: any): Provider => {
  const link =
    hub.providers
      ?.find((provider: any) => provider.type === 'SPOTIFY')
      ?.actions?.find((action: any) => action.type === 'uri').uri || ''

  return {
    name: 'Spotify',
    type: 'spotify',
    link,
  }
}

const findAppleMusicProvider = (hub: any): Provider => {
  const link =
    hub.options
      ?.find((opt: any) => opt.caption === 'OPEN')
      ?.actions?.find((action: any) => action.type === 'applemusicopen').uri ||
    ''

  return {
    name: 'Apple Music',
    type: 'apple-music',
    link,
  }
}

const findPreviewURL = (hubActions: any[]) => {
  return (
    hubActions?.find(
      (action: any) => action.name === 'apple' && action.type === 'uri'
    )?.uri || ''
  )
}

const getSongVers2 = async (key: string): Promise<SongInterface | null> => {
  const { data } = await axiosClient.get<any, AxiosResponse<any>>(
    '/songs/v2/get-details',
    {
      params: {
        id: key,
      },
    }
  )

  if (data.data?.[0]) {
    const song = data.data?.[0]

    return {
      key: song.key,
      title: song.attributes.name,
      subtitle: song.attributes.artistName,
      artistIds: [],
      coverart: String(song.attributes?.artwork?.url || "").replace(
        '{w}x{h}bb.jpg',
        '200x200bb.jpg'
      ),
      lyrics: {
        text: [],
        footer: '',
      },
      previewURL: song.attributes.previews?.[0]?.url || '',
      providers: [],
    }
  }

  return null
}

export const getSong = async (key: string): Promise<SongInterface | null> => {
  const { data } = await axiosClient.get<any, AxiosResponse<any>>(
    '/songs/get-details',
    {
      params: {
        key,
      },
    }
  )

  if (!data || Object.keys(data).length === 0) {
    return await getSongVers2(key)
  }

  return {
    key: data.key,
    title: data.title,
    subtitle: data.subtitle,
    artistIds: data.artists?.map((artist: any) => artist.adamid),
    coverart: data.images?.coverart || "",
    lyrics: findLyrics(data.sections) as SongInterface['lyrics'],
    previewURL: findPreviewURL(data.hub.actions),
    providers: [
      { ...findAppleMusicProvider(data.hub) },
      {
        ...findSpotifyProvider(data.hub),
      },
    ],
  }
}

export const getArtist = async (
  id: string
): Promise<ArtistInterface | null> => {
  const { data } = await axiosClient.get<any, AxiosResponse<any>>(
    '/artists/get-summary',
    {
      params: {
        id,
      },
    }
  )

  if (!data.resources) return null

  const artists = data.resources.artists
  const albums = data.resources.albums

  const artist = artists[Object.keys(artists)[0]]

  return {
    id: artist.id,
    topSongs: await getTopSongs(id),
    albums: Object.keys(albums).map((key: any) => {
      const album = albums[key]

      return {
        id: album.id,
        name: album.attributes.name,
        releaseDate: album.attributes.releaseDate,
        coverart: String(album.attributes?.artwork?.url || "").replace(
          '{w}x{h}bb.jpg',
          '200x200bb.jpg'
        ),
        tracks: [],
        artistIds: [],
      } satisfies AlbumInterface
    }),
    name: artist.attributes.name,
    picture: String(artist.attributes?.artwork?.url || "").replace(
      '{w}x{h}bb.jpg',
      '200x200bb.jpg'
    ),
  }
}

export const getRecommendations = async (
  key: string
): Promise<SongInterface[]> => {
  const { data } = await axiosClient.get<any, AxiosResponse<any>>(
    '/songs/list-recommendations',
    {
      params: {
        key,
      },
    }
  )

  if (!data.tracks) return []

  return data.tracks.map((data: any) => ({
    key: data.key,
    title: data.title,
    subtitle: data.subtitle,
    artistIds: data.artists?.map((artist: any) => artist.adamid),
    coverart: data.images.coverart,
    lyrics: [],
    previewURL: findPreviewURL(data.hub.actions),
    providers: [
      { ...findAppleMusicProvider(data.hub) },
      {
        ...findSpotifyProvider(data.hub),
      },
    ],
  }))
}

export const getTopSongs = async (
  artistId: string
): Promise<SongInterface[]> => {
  const { data } = await axiosClient.get<any, AxiosResponse<any>>(
    '/artists/get-top-songs',
    {
      params: {
        id: artistId,
      },
    }
  )

  if (!data.data) return []

  return data.data.map((data: any) => ({
    key: data.id,
    title: data.attributes.name,
    subtitle: data.attributes.artistName,
    artistIds: [],
    coverart: String(data.attributes?.artwork?.url || "").replace(
      '{w}x{h}bb.jpg',
      '200x200bb.jpg'
    ),
    lyrics: [],
    previewURL: data.attributes.previews?.[0]?.url || '',
    providers: [],
  }))
}

export const getAlbum = async (id: string): Promise<AlbumInterface> => {
  const { data } = await axiosClient.get<any, AxiosResponse<any>>(
    '/albums/get-details',
    {
      params: {
        id,
      },
    }
  )

  if (!data.data?.length || !data) {
    throw new Error('Album Not Found')
  }

  const album = data.data[0]

  return {
    id: album.id,
    name: album.attributes.name,
    artistIds: album.relationships.artists.data?.map(
      (artist: any) => artist.id
    ),
    releaseDate: album.attributes.releaseDate,
    coverart: String(album.attributes?.artwork?.url || "").replace(
      '{w}x{h}bb.jpg',
      '200x200bb.jpg'
    ),
    tracks: album.relationships.tracks.data.map((track: any) => ({
      key: track.id,
      title: track.attributes.name,
      subtitle: track.attributes.artistName,
      artistIds: [],
      coverart: String(track.attributes?.artwork?.url || "").replace(
        '{w}x{h}bb.jpg',
        '200x200bb.jpg'
      ),
      lyrics: [],
      previewURL: track.attributes.previews?.[0]?.url || '',
      providers: [],
    })),
  }
}

export const search = async (
  keyword: string,
  page: number
): Promise<SearchResult> => {
  // limit = 10
  // page 2 = 2 * 10 = 20
  const offset = page == 1 ? 0 : page * 5

  const { data } = await axiosClient.get<any, AxiosResponse<any>>('/search', {
    params: {
      term: keyword,
      offset,
      limit: 5,
    },
  })

  if (!data) {
    return {
      artists: [],
      tracks: [],
    }
  }

  return {
    artists: (data.artists?.hits ?? []).map((data: any) => {
      const artist = data.artist

      return {
        id: artist.id || artist.adamid,
        topSongs: [],
        albums: [],
        name: artist.name,
        picture: artist.avatar,
      }
    }) ?? [],
    tracks: (data.tracks?.hits ?? []).map((data: any) => {
      const song = data.track

      return {
        key: song.key,
        title: song.title,
        subtitle: song.subtitle,
        artistIds: [],
        coverart: song.images?.coverart  || "",
        lyrics: [],
        previewURL: findPreviewURL(song.hub.actions),
        providers: [],
      }
    }) ?? [],
  }
}
