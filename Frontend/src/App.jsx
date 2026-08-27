// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import { FaceDetector } from '@mediapipe/tasks-vision'
// import FaceExpressionDetector from './features/Expression/components/FaceExpressionDetector'

import {RouterProvider} from 'react-router'
import {router} from './app.routes.jsx'
import './features/shared/styles/global.scss'
import { AuthProvider } from './features/Auth/auth.context.jsx'

function App() {

  return (

    <AuthProvider>
       <RouterProvider router={router} />
    </AuthProvider>
      // <FaceExpressionDetector />
      
  )
}

export default App
