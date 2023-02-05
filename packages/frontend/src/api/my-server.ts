import axios, { AxiosResponse } from 'axios'
import { AlbumInterface, ApiResponse, ArtistInterface, SearchResult, SongInterface } from 'common'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

export const detectSong = async (
  sample: Blob
): Promise<ApiResponse<string>> => {
  const { data } = await axiosClient.post<
    any,
    AxiosResponse<ApiResponse<string>>
  >(
    '/song/detect',
    {
      sample,
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return data
}

export const getSong = async (
  key: string
): Promise<ApiResponse<SongInterface>> => {
  const { data } = await axiosClient.get<
    any,
    AxiosResponse<ApiResponse<SongInterface>>
  >(`/song/show/${key}`)

  return data
}

export const getArtist = async (
  id: string
): Promise<ApiResponse<ArtistInterface>> => {
  const { data } = await axiosClient.get<
    any,
    AxiosResponse<ApiResponse<ArtistInterface>>
  >(`/artist/show/${id}`)

  return data
}

export const getRecommendations = async (
  key: string
): Promise<ApiResponse<SongInterface[]>> => {
  const { data } = await axiosClient.get<
    any,
    AxiosResponse<ApiResponse<SongInterface[]>>
  >(`/song/recommendations/${key}`)

  return data
}

export const getAlbum = async (
  id: string
): Promise<ApiResponse<AlbumInterface>> => {
  const { data } = await axiosClient.get<
    any,
    AxiosResponse<ApiResponse<AlbumInterface>>
  >(`/album/show/${id}`)

  return data
}

export const search = async (
  keyword: string,
  page: number
): Promise<ApiResponse<SearchResult>> => {
  const { data } = await axiosClient.get<
    any,
    AxiosResponse<ApiResponse<SearchResult>>
  >(`/search/${keyword}`, {
    params: {
      page
    }
  })

  return data
}