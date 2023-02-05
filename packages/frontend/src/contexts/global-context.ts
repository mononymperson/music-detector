import { createContext, useContext } from 'react'

export interface ImageThemeState {
    color: string
    isDark: boolean
  }

interface Context {
  imageTheme: ImageThemeState
  setImageTheme: (config: ImageThemeState) => any
  imageThemeModeValue: (dark: any, light: any) => any
  togglePlayAudio: (url: string) => any
  onPlayingAudio: (url: string, onPlay: any, onStop: any) => any
}

export const GlobalContext = createContext<Context>({} as Context)

export const useGlobalContext = () => useContext(GlobalContext)
