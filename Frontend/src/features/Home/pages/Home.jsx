import FaceExpressionDetector from '../../Expression/components/FaceExpressionDetector'
import Player from '../components/player'
import useSong from '../hooks/useSong'
import '../styles/player.scss'

const getMoodFromExpression = (expression = '') => {
  const normalizedExpression = expression.toLowerCase()
  if (normalizedExpression.includes('sad')) return 'sad'
  if (normalizedExpression.includes('angry')) return 'angry'
  if (normalizedExpression.includes('surprised')) return 'surprised'
  return 'happy'
}

const Home = () => {
  const { loading, song, handleGetSong } = useSong()
  const handleExpressionDetected = (expression) => handleGetSong({ mood: getMoodFromExpression(expression) })

  return (
    <main className="home">
      <header className="home__header">
        <p className="home__label">MoodTune</p>
        <h1>Music that meets you where you are.</h1>
        <p className="home__intro">Detect your expression, then settle into a track picked for your mood.</p>
      </header>
      <div className="home__grid">
        <section className="home__detector"><FaceExpressionDetector onExpressionDetected={handleExpressionDetected} /></section>
        <section className="home__player-panel">
          <Player />
          <button className="home__new-song" type="button" onClick={() => handleGetSong({ mood: song?.mood || 'happy', excludeSongId: song?._id })} disabled={loading}>
            {loading ? 'Finding a song…' : 'Find another song'}
          </button>
        </section>
      </div>
    </main>
  )
}

export default Home
