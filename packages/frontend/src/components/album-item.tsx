import { Link } from 'react-router-dom'

import { Image } from './image'

interface Props {
  album: {
    id: string
    src: string
    title: string
  }
}

export const AlbumItem = (props: Props) => {
  return (
    <Link to={`/album/${props.album.id}`} className="py-3">
      <Image src={props.album.src}></Image>
      <p className="p-3">{props.album.title}</p>
    </Link>
  )
}
