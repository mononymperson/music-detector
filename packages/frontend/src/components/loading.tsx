import { FaSpinner } from 'react-icons/fa'

import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'

interface Props extends CustomComponentProps {
  title?: string
}

export const Loading = (props: Props) => {
  return (
    <div
      className={mergeClassName(
        'flex text-xl gap-1.5 items-center text-primary justify-center p-3',
        props.className
      )}
    >
      <FaSpinner className="animate-spin"></FaSpinner>
      <span>{props.title ?? 'Loading'}</span>
    </div>
  )
}
