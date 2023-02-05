import { useEffect, useState } from 'react'
import { MdChevronRight } from 'react-icons/md'

interface Props {
  lyrics: string[]
  footer: string
}

export const Lyrics = (props: Props) => {
  const [limit, setLimit] = useState(5)

  const [showAll, setShowAll] = useState(false)

  const toggleShow = () => {
    setShowAll(!showAll)
  }

  useEffect(() => {
    if (showAll) {
      setLimit(props.lyrics.length)
    } else {
      if (window.scrollY === 0) {
        setLimit(5)
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })

        const onscroll = () => {
          if (window.scrollY === 0) {
            setLimit(5)
            window.removeEventListener('scroll', onscroll)
          }
        }

        window.addEventListener('scroll', onscroll)
      }
    }
  }, [showAll])

  return (
    <div>
      {props.lyrics.map((lyric, i) => {
        return i > limit ? (
          ''
        ) : (
          <p key={i} className={lyric ? `py-1` : `pb-5`}>
            {lyric}
          </p>
        )
      })}
      {showAll ? (
        <div className="pt-5 text-muted">
          {props.footer.split('\n').map((txt, i) => (
            <p key={i} className="py-0.5">
              {txt}
            </p>
          ))}
        </div>
      ) : (
        ''
      )}
      <button
        onClick={() => toggleShow()}
        className="uppercase text-primary pt-3 flex items-center text-sm font-semibold"
      >
        <span>{!showAll ? 'show all' : 'show less'}</span>
        <MdChevronRight
          className={!showAll ? 'rotate-90' : '-rotate-90'}
        ></MdChevronRight>
      </button>
    </div>
  )
}
