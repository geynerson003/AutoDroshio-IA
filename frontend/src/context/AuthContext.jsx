import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          const userData = await api.getCurrentUser()
          setUser(userData)
        } catch (err) {
          // Token is invalid/expired — clean up gracefully
          // Don't rely on the interceptor here; clean up ourselves
          console.log('[Auth] Token validation failed, clearing auth')
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
        // perform login call (api.login stores token/user in localStorage)
      const data = await api.login(email, password)
      const userData = {
        id: data.user_id,
        email: data.email,
      }
      // persist user in context and storage
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, username, password, fullName) => {
    setError(null)
    setLoading(true)
    try {
      await api.register(email, username, password, fullName)
      // Auto-login after registration
      const loginResult = await login(email, password)
      return loginResult
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
