import { createBrowserRouter } from 'react-router'
import Register from './features/Auth/pages/Register'
import Login from './features/Auth/pages/Login'
import Protected from './features/Auth/components/protected';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected><h1>Home</h1></Protected>
  },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    }
]);