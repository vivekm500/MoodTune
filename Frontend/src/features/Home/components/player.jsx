import { useEffect, useRef, useState } from 'react'
import useSong from '../hooks/useSong'
import '../styles/player.scss'

const formatTime = (seconds = 0) => {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

const Player = () => {
  const audioRef = useRef(null)
  const shouldAutoplayNextRef = useRef(false)
  const { song, loading, handleGetSong } = useSong()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [autoplayNext, setAutoplayNext] = useState(true)
  const [loopCurrent, setLoopCurrent] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [song?.url])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio || !song?.url) return
    if (audio.paused) {
      try { await audio.play() } catch { setIsPlaying(false) }
    } else audio.pause()
  }

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value)
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const skipBy = (seconds) => {
    const audio = audioRef.current
    if (!audio) return
    const nextTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds))
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  const handleSpeedChange = (event) => {
    const nextSpeed = Number(event.target.value)
    audioRef.current.playbackRate = nextSpeed
    setSpeed(nextSpeed)
  }

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value)
    audioRef.current.volume = nextVolume
    setVolume(nextVolume)
  }

  const handleSongEnded = () => {
    setIsPlaying(false)
    shouldAutoplayNextRef.current = autoplayNext
    handleGetSong({ mood: song.mood, excludeSongId: song._id }).then((nextSong) => {
      // If this mood has only one track, restart that same track immediately.
      if (autoplayNext && nextSong?.url === song.url && audioRef.current) {
        shouldAutoplayNextRef.current = false
        audioRef.current.currentTime = 0
        return audioRef.current.play()
      }
      return undefined
    }).catch((error) => {
      shouldAutoplayNextRef.current = false
      console.error('Could not load the next song:', error)
    })
  }

  const handleCanPlay = async () => {
    if (!shouldAutoplayNextRef.current) return
    shouldAutoplayNextRef.current = false
    try { await audioRef.current.play() } catch { setIsPlaying(false) }
  }

  if (!song?.url) return null

  return (
    <section className="player" aria-label="Music player" aria-busy={loading}>
      <audio ref={audioRef} src={song.url} loop={loopCurrent} onCanPlay={handleCanPlay} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={handleSongEnded} />
      <div className="player__artwork">
        <img className="player__artwork-background" src={song.posterUrl} alt="" aria-hidden="true" />
        <img className="player__artwork-image" src={song.posterUrl} alt={`${song.title} artwork`} />
        <span>NOW PLAYING</span>
      </div>
      <div className="player__content">
        {loading && <p className="player__loading">Loading another mood match...</p>}
        <div className="player__song-details">
          <p className="player__eyebrow">Mood match: {song.mood || 'made for you'}</p>
          <h2>{song.title}</h2>
        </div>
        <div className="player__timeline">
          <span>{formatTime(currentTime)}</span>
          <input aria-label="Song progress" type="range" min="0" max={duration || 0} value={Math.min(currentTime, duration || 0)} onChange={handleSeek} />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="player__controls">
          <button type="button" className="player__skip" onClick={() => skipBy(-10)} aria-label="Go back 10 seconds">Back <span>10</span></button>
          <button type="button" className="player__play" onClick={togglePlayback} aria-label={isPlaying ? 'Pause song' : 'Play song'}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button type="button" className="player__skip" onClick={() => skipBy(10)} aria-label="Go forward 10 seconds"><span>10</span> Next</button>
        </div>
        <div className="player__settings">
          <label className="player__speed">Speed
            <select value={speed} onChange={handleSpeedChange} aria-label="Playback speed">
              <option value="0.75">0.75x</option><option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option>
            </select>
          </label>
          <label className="player__volume">Volume
            <input aria-label="Volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
          </label>
          <label className="player__toggle">
            <input type="checkbox" checked={autoplayNext} onChange={(event) => setAutoplayNext(event.target.checked)} />
            Autoplay next
          </label>
          <label className="player__toggle">
            <input type="checkbox" checked={loopCurrent} onChange={(event) => setLoopCurrent(event.target.checked)} />
            Loop song
          </label>
        </div>
      </div>
    </section>
  )
}

export default Player
