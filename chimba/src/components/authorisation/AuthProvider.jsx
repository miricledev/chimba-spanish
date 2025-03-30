import React, { useContext, useState, createContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('chimbaUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userDetails) => {
    setUser(userDetails)
    localStorage.setItem('chimbaUser', JSON.stringify(userDetails))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('chimbaUser')
    navigate('/login') // make sure logout redirects too
  }

  const redirectIfNotLoggedIn = () => {
    const storedUser = localStorage.getItem('chimbaUser')
    if (!storedUser) {
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, redirectIfNotLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
