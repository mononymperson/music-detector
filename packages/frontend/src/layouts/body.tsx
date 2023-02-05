import { Navigate, Route, Routes } from 'react-router-dom'

import { Album } from '../views/album'
import { Artist } from '../views/artist'
import { Home } from '../views/home'
import { Search } from '../views/search'
import { Track } from '../views/track'

export const Body = () => {
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/track/:id" element={<Track></Track>}></Route>
      <Route path="/artist/:id" element={<Artist></Artist>}></Route>
      <Route path="/album/:id" element={<Album></Album>}></Route>
      <Route path="/search" element={<Search></Search>}></Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
