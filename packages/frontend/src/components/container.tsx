import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'

export const Container = (props: CustomComponentProps) => {
  return (
    <div
      className={mergeClassName(
        'w-full max-w-screen-lg mx-auto px-6 py-3',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
