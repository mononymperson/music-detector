export interface ApiResponse<T> {
  status: 200 | 400 | 404 | 0;
  message: string;
  data: T | null;
}

export interface AlbumInterface {
  id: string
  name: string
  artistIds: string[]
  releaseDate: string
  coverart: string
  tracks: SongInterface[]
}

export interface ArtistInterface {
  id: string
  name: string
  picture: string
  albums: AlbumInterface[]
  topSongs: SongInterface[]
}

export type ProviderType = "spotify" | "apple-music";

export interface Provider {
  name: string;
  link: string;
  type: ProviderType;
}

export interface SongInterface {
  key: string;
  title: string;
  subtitle: string;
  coverart: string;
  artistIds: string[];
  lyrics: {
    text: string[],
    footer: string
  };
  providers: Provider[];
  previewURL: string;
}

export interface SearchResult {
  tracks: SongInterface[]
  artists: ArtistInterface[]
}