import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'

interface Props extends CustomComponentProps {
  src: string
  alt?: string
}

export const Image = (props: Props) => {
  return (
    <div
      className={mergeClassName(
        'w-[200px] h-[200px] bg-primary rounded-lg overflow-hidden',
        props.className
      )}
    >
      <img
        src={props.src}
        alt={props.alt}
        className="object-cover w-full h-full"
      ></img>
    </div>
  )
}
