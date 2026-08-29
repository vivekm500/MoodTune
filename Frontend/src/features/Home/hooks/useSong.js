import { useContext } from 'react'
import { SongContext } from '../song.context'
import { getSong } from '../service/song.api'

const useSong = () => {
  const context = useContext(SongContext)

  if (!context) {
    throw new Error('useSong must be used within SongContextProvider')
  }

  const { song, setSong, loading, setLoading } = context

  async function handleGetSong({ mood, excludeSongId = song?._id }) {
    setLoading(true)
    try {
      const data = await getSong({ mood, excludeSongId })
      setSong(data.song)
      return data.song
    } finally {
      setLoading(false)
    }
  }

  return { loading, song, handleGetSong }
}

export default useSong
