import { CustomComponentProps } from '../interfaces'

export const Grid = (props: CustomComponentProps) => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 mobile:grid-cols-2 gap-6">
      {props.children}
    </div>
  )
}
