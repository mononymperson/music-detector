import { IoIosPause, IoIosPlay } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import { useGlobalContext } from '../contexts/global-context'
import { Image } from './image'

interface Props {
  song: {
    id: string
    title: string
    artist: string
    coverart: string
    previewURL: string
  }
}

export const SongItem = (props: Props) => {
  const globalContext = useGlobalContext()

  const navigate = useNavigate()

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        navigate(`/track/${props.song.id}`)
      }}
      className="flex items-center bg-component p-3 rounded-lg mb-3 gap-3 cursor-pointer"
    >
      <Image
        className="max-w-[48px] max-h-[48px]"
        alt={props.song.title}
        src={props.song.coverart}
      ></Image>
      <div className="flex-1">
        <p className="truncate text-base">{props.song.title}</p>
        <p className="text-muted truncate text-base">{props.song.artist}</p>
      </div>
      <button
        disabled={!props.song.previewURL}
        onClick={(e) => {
          e.stopPropagation()
          globalContext.togglePlayAudio(props.song.previewURL)
        }}
        className="rounded-lg border border-light p-1 cursor-default"
        title={`play-${props.song.title}-song`}
      >
        {globalContext.onPlayingAudio(
          props.song.previewURL,
          <IoIosPause size={18}></IoIosPause>,
          <IoIosPlay size={18}></IoIosPlay>
        )}
      </button>
    </div>
  )
}
