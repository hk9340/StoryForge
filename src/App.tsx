import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import WorkDetail from './pages/WorkDetail'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Landing />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/works/:id" element={<WorkDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
