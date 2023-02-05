import { Link } from 'react-router-dom'

import { Image } from './image'

interface Props {
  artist: {
    id: string
    src: string
    name: string
  }
}

export const ArtistItem = (props: Props) => {
  return (
    <Link
      to={`/artist/${props.artist.id}`}
      className="py-3 flex flex-col items-center"
    >
      <Image className="rounded-full" src={props.artist.src}></Image>
      <p className="py-6">{props.artist.name}</p>
    </Link>
  )
}
