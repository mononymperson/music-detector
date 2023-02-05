import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'

interface Props extends CustomComponentProps {
  title?: string
  hide?: boolean
}

export const Section = (props: Props) => {
  return props.hide ? (
    <></>
  ) : (
    <div className={mergeClassName('px-1.5 py-3', props.className)}>
      {props.title ? (
        <h1 className="text-lg font-semibold pb-3">{props.title}</h1>
      ) : (
        ''
      )}
      {props.children}
    </div>
  )
}
