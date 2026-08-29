import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import './features/shared/styles/global.scss'
import { AuthProvider } from './features/Auth/auth.context.jsx'
import { SongContextProvider } from './features/Home/song.context.jsx'

function App() {
  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
  )
}

export default App
