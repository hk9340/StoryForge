import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ConfirmProvider } from './contexts/ConfirmContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import WorkDetail from './pages/WorkDetail'
import Profile from './pages/Profile'
import NewWork from './pages/NewWork'
import MyWorks from './pages/MyWorks'
import './App.css'

function App() {
  return (
    <ThemeProvider>
    <ConfirmProvider>
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
          <Route path="/new-work" element={<NewWork />} />
          <Route path="/my-works" element={<MyWorks />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
    </ConfirmProvider>
    </ThemeProvider>
  )
}

export default App
