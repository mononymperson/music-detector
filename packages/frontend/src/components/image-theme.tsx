import { FastAverageColor } from 'fast-average-color'
import { useEffect, useRef } from 'react'

import { useGlobalContext } from '../contexts/global-context'
import { CustomComponentProps } from '../interfaces'
import { mergeClassName } from '../utils'

interface Props extends CustomComponentProps {
  src: string
  alt?: string
}

export const ImageTheme = (props: Props) => {
  const imageRef = useRef<HTMLImageElement>(null)

  const globalContext = useGlobalContext()

  const getImageTheme = async () => {
    if (!imageRef.current) return

    const fac = new FastAverageColor()

    try {
      const color = await fac.getColorAsync(imageRef.current)

      globalContext.setImageTheme({
        color: color.hex,
        isDark: color.isDark,
      })
    } catch (error) {
      globalContext.setImageTheme({
        color: '#0284C7',
        isDark: true,
      })
    }
  }

  useEffect(() => {
    getImageTheme()
  }, [])

  return (
    <div
      className={mergeClassName(
        'w-[200px] h-[200px] bg-primary rounded-lg overflow-hidden',
        props.className
      )}
    >
      <img
        crossOrigin=""
        ref={imageRef}
        src={props.src}
        alt={props.alt}
        className="object-cover w-full h-full"
      ></img>
    </div>
  )
}
