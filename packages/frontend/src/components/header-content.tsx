import { useGlobalContext } from '../contexts/global-context'
import { CustomComponentProps } from '../interfaces'

export const HeaderContent = (props: CustomComponentProps) => {
  const globalContext = useGlobalContext()

  return (
    <div
      className={props.className}
      style={{
        background: `linear-gradient(to bottom, ${globalContext.imageTheme.color}, var(--dark) 50%)`,
      }}
    >
      {props.children}
    </div>
  )
}
