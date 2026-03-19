import { createContext, useContext, useState, type ReactNode } from 'react'
import { SAMPLE_USER } from '../data/sampleData'

interface User {
  email: string
  name: string
  bio: string
  joinDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string): boolean => {
    if (email === SAMPLE_USER.email && password === SAMPLE_USER.password) {
      setUser({
        email: SAMPLE_USER.email,
        name: SAMPLE_USER.name,
        bio: SAMPLE_USER.bio,
        joinDate: SAMPLE_USER.joinDate,
      })
      return true
    }
    return false
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
