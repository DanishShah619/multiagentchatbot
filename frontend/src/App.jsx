import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'
import getCurrentUser from './features/getCurrentUser'
import { setUserdata } from './redux/userSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser()
        if (data) {
          dispatch(setUserdata(data))
        }
      } catch (err) {
        console.error('[App/getUser]', err)
      }
    }
    getUser()
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
