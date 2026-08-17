import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { FaceDetector } from '@mediapipe/tasks-vision'
import FaceExpressionDetector from './features/Expression/components/FaceExpressionDetector'

function App() {
  const [count, setCount] = useState(0)

  return (

      <FaceExpressionDetector />
      
  )
}

export default App
