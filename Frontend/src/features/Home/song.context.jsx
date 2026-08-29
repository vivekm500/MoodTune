import { createContext, useState } from 'react'

export const SongContext = createContext(null)

const defaultSong = {
  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  posterUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85',
  title: 'Golden Hour',
  mood: 'calm',
}

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState(defaultSong)
  const [loading, setLoading] = useState(false)

  return (
    <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  )
}
