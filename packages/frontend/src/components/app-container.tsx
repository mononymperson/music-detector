import { useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { GlobalContext, ImageThemeState } from '../contexts/global-context'
import { Body } from '../layouts/body'
import { Footer } from '../layouts/footer'
import { Header } from '../layouts/header'

export const AppContainer = () => {
  const [imageTheme, setImageTheme] = useState<ImageThemeState>({
    color: '',
    isDark: true,
  })

  const audioRef = useRef<HTMLAudioElement>()

  const [currentAudioURL, setCurrentAudioURL] = useState('')

  const playSong = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    if (url === currentAudioURL) {
      audioRef.current = undefined
      setCurrentAudioURL('')
      return
    }

    audioRef.current = new Audio(url)

    audioRef.current.play()

    setCurrentAudioURL(url)
  }

  return (
    <BrowserRouter>
      <GlobalContext.Provider
        value={{
          imageTheme,
          setImageTheme,
          onPlayingAudio(url, onPlay, onStop) {
            if (url === '') return onStop

            if (currentAudioURL === url) {
              return onPlay
            }

            return onStop
          },
          togglePlayAudio(url) {
            playSong(url)
          },
          imageThemeModeValue(dark, light) {
            if (imageTheme.isDark) {
              return dark
            }

            return light
          },
        }}
      >
        <Header></Header>
        <Body></Body>
        <Footer></Footer>
      </GlobalContext.Provider>
    </BrowserRouter>
  )
}
