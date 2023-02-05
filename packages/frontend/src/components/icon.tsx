import { ProviderType } from 'common'

import AppleMusicIcon from '../assets/apple_music_logo.png'
import SpotifyIcon from '../assets/spotify_icon.png'

interface Props {
  name: ProviderType
}

export const Icon = (props: Props) => {
  let src = ''

  switch (props.name) {
    case 'spotify':
      src = SpotifyIcon
      break

    case 'apple-music':
      src = AppleMusicIcon
      break
  }

  return (
    <img
      className="w-[32px] h-[32px]"
      src={src}
      alt={props.name + '-icon'}
    ></img>
  )
}
