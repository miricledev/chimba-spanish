import React, {useContext, useState, createContext} from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({children}) => {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)

    const login = (userDetails) => {
      setUser(userDetails)
    }

    const logout = () => {
      setUser(null)
      
    }

    const redirectIfNotLoggedIn = () => {
      if(!user){
        navigate('/login')
      }
    }

  return (
    <div>
        <AuthContext.Provider value={{user, login, logout, redirectIfNotLoggedIn}}>
            {children}
        </AuthContext.Provider>
    </div>
  )
}

export default AuthProvider