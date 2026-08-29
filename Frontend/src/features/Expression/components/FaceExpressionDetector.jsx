import { useEffect, useRef, useState } from 'react'
import {
  createFaceLandmarker,
  startCamera,
  getBlendshapeScores,
  detectExpression,
  stopCamera,
  closeFaceLandmarker,
} from '../Utils/utils'

const waitForVideoData = (video) => new Promise((resolve, reject) => {
  if (video.readyState >= 2) {
    resolve()
    return
  }

  const timeoutId = setTimeout(() => {
    cleanup()
    reject(new Error('Camera video did not become ready'))
  }, 10000)

  const onReady = () => {
    cleanup()
    resolve()
  }

  const cleanup = () => {
    clearTimeout(timeoutId)
    video.removeEventListener('loadeddata', onReady)
    video.removeEventListener('playing', onReady)
  }

  video.addEventListener('loadeddata', onReady, { once: true })
  video.addEventListener('playing', onReady, { once: true })
})

export default function FaceExpressionDetector({ onExpressionDetected }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const faceLandmarkerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const lastVideoTimeRef = useRef(-1)
  const closeTimerRef = useRef(null)
  const isMountedRef = useRef(true)
  const [isDetecting, setIsDetecting] = useState(false)
  const [status, setStatus] = useState('Camera is off')
  const [detectedResult, setDetectedResult] = useState(null)

  const closeDetector = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    stopCamera(streamRef.current)
    closeFaceLandmarker(faceLandmarkerRef.current)
    animationFrameRef.current = null
    streamRef.current = null
    faceLandmarkerRef.current = null
    lastVideoTimeRef.current = -1
    closeTimerRef.current = null
  }

  useEffect(() => {
    // React Strict Mode runs an extra setup/cleanup cycle in development.
    // Reset this ref whenever the component is mounted so the frame loop runs.
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      closeDetector()
    }
  }, [])

  const finishDetection = (result) => {
    closeDetector()
    if (!isMountedRef.current) return
    setDetectedResult(result)
    setStatus('Camera is off')
    setIsDetecting(false)
  }

  const handleDetectExpression = async () => {
    if (isDetecting) return

    setDetectedResult(null)
    setIsDetecting(true)
    setStatus('Requesting camera permission...')

    try {
      // Wait for React to show the video element before attaching the stream.
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const video = videoRef.current
      const stream = await startCamera(video)
      streamRef.current = stream
      await waitForVideoData(video)
      setStatus('Loading expression detector...')

      const faceLandmarker = await createFaceLandmarker()
      faceLandmarkerRef.current = faceLandmarker
      setStatus('Look at the camera...')

      const detectFrame = () => {
        const video = videoRef.current
        const detector = faceLandmarkerRef.current

        if (!video || !detector || !isMountedRef.current) return

        try {
          if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = video.currentTime
            const result = detector.detectForVideo(video, performance.now())
            const scoreMap = getBlendshapeScores(result)

            if (scoreMap) {
              const expression = detectExpression(scoreMap)
              setDetectedResult(expression)
              setStatus('Expression captured. Finding a matching song...')
              Promise.resolve(onExpressionDetected?.(expression)).catch((error) => {
                console.error('Could not load a matched song:', error)
              })
              closeTimerRef.current = setTimeout(() => finishDetection(expression), 1000)
              return
            }

            setStatus('No face found. Please look at the camera...')
          }
        } catch (error) {
          console.error('Face detection frame error:', error)
          closeDetector()
          setStatus('Camera detection failed')
          setIsDetecting(false)
          return
        }

        animationFrameRef.current = requestAnimationFrame(detectFrame)
      }

      detectFrame()
    } catch (error) {
      console.error('Expression detection error:', error)
      closeDetector()
      if (isMountedRef.current) {
        setStatus('Camera is off')
        setIsDetecting(false)
        setDetectedResult('Unable to access the camera')
      }
    }
  }

  

  return (
    <div style={{ padding: '1.25rem', textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: '19rem', margin: '0 auto', aspectRatio: '1 / .78', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
        {isDetecting ? (
          <video ref={videoRef} autoPlay muted playsInline style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        ) : (
          <div aria-label="Default smiling profile illustration" role="img" style={{ display: 'grid', width: '100%', height: '100%', placeItems: 'center', background: 'linear-gradient(135deg, #dcc4ff, #8c74d6)' }}>
            <div style={{ position: 'relative', width: '7rem', height: '7rem', borderRadius: '50%', background: '#f6d162', boxShadow: '0 .6rem 1.5rem rgba(29, 17, 56, .2)' }}>
              <span style={{ position: 'absolute', top: '2.75rem', left: '2rem', width: '.65rem', height: '.65rem', borderRadius: '50%', background: '#3b2a1c' }} />
              <span style={{ position: 'absolute', top: '2.75rem', right: '2rem', width: '.65rem', height: '.65rem', borderRadius: '50%', background: '#3b2a1c' }} />
              <span style={{ position: 'absolute', left: '2.35rem', bottom: '1.75rem', width: '2.3rem', height: '1.1rem', border: '.28rem solid #3b2a1c', borderTop: 0, borderRadius: '0 0 2rem 2rem' }} />
            </div>
          </div>
        )}
      </div>

      <p style={{ minHeight: '1.25rem', marginTop: '.8rem', color: '#bcb8c9', fontSize: '.8rem' }}>{status}</p>
      <button onClick={handleDetectExpression} disabled={isDetecting} style={{ border: 'none', borderRadius: '.75rem', padding: '.65rem 1rem', marginBlock: '.5rem 1rem', cursor: isDetecting ? 'wait' : 'pointer', opacity: isDetecting ? .7 : 1 }}>
        {isDetecting ? 'Detecting...' : 'Detect Expression'}
      </button>

      {detectedResult && (
        <div>
          <p style={{ color: '#bcb8c9', fontSize: '.8rem' }}>Detected expression</p>
          <h2 style={{ marginTop: '.2rem' }}>{detectedResult}</h2>
        </div>
      )}
    </div>
  )
}
