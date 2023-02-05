import { useEffect, useRef, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { Container } from '../components/container'
import { useGlobalContext } from '../contexts/global-context'

export const Header = () => {
  const globalContext = useGlobalContext()

  const location = useLocation()
  const [query, _] = useSearchParams()
  const navigate = useNavigate()

  const searchRef = useRef<HTMLInputElement>(null)
  const [searchKeyword, setSearchKeyword] = useState('')

  const [isScrollBelowHeader, setIsScrollBelowHeader] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)

  const search = () => {
    if (searchKeyword) {
      navigate(`/search?keyword=${searchKeyword}`)
    }
  }

  const scrollBelowHeader = (
    isScrollBelowHeader: boolean,
    onBelow: any,
    onAbove: any
  ) => {
    if (isScrollBelowHeader) {
      return onBelow
    }

    return onAbove
  }

  const onWindowScroll = () => {
    if (window.scrollY > (headerRef.current?.offsetHeight || 0)) {
      setIsScrollBelowHeader(true)
    } else {
      setIsScrollBelowHeader(false)
    }
  }

  useEffect(() => {
    globalContext.setImageTheme({
      color: '',
      isDark: true,
    })
    setIsScrollBelowHeader(false)
    setSearchKeyword(query.get('keyword') || '')
    searchRef.current?.blur()
  }, [location])

  useEffect(() => {
    window.addEventListener('scroll', onWindowScroll)

    return () => {
      window.removeEventListener('scroll', onWindowScroll)
    }
  }, [])

  return (
    <div
      ref={headerRef}
      style={{
        background: scrollBelowHeader(
          isScrollBelowHeader,
          '',
          globalContext.imageTheme.color
        ),
      }}
      className={`sticky top-0 `}
    >
      {/* background */}
      <div
        className={`absolute left-0 right-0 top-0 bottom-0 ${scrollBelowHeader(
          isScrollBelowHeader,
          'backdrop-blur-md bg-body',
          ''
        )}`}
      ></div>

      <Container className="flex gap-3 justify-between mobile:flex-col mobile:items-center relative">
        <h1
          className={`text-2xl ${
            isScrollBelowHeader
              ? ''
              : globalContext.imageThemeModeValue('text-light', 'text-dark')
          }`}
        >
          <Link to={'/'}>Musiclue</Link>
        </h1>
        {/* search */}
        <div
          className={`
            flex
            items-center
            gap-3
            py-1.5
            px-3
            rounded-lg
            ${
              isScrollBelowHeader
                ? 'bg-light text-dark'
                : globalContext.imageThemeModeValue(
                    `bg-light text-dark`,
                    `bg-dark text-light`
                  )
            }
        `}
        >
          <input
            ref={searchRef}
            value={searchKeyword}
            onKeyDown={(e) => (e.key === 'Enter' ? search() : '')}
            onInput={(e) => setSearchKeyword(e.currentTarget.value)}
            placeholder="search music, artist"
            type="text"
            className={`bg-transparent outline-0 ${
              isScrollBelowHeader
                ? ''
                : globalContext.imageThemeModeValue(
                    'placeholder:text-dark',
                    'placehlder:text-light'
                  )
            }`}
          />
          <IoIosSearch size={18}></IoIosSearch>
        </div>
      </Container>
    </div>
  )
}
