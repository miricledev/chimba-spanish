import React from 'react'
import Register from './components/registration/Register'
import Login from './components/login/Login'
import AuthProvider from './components/authorisation/AuthProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AuthorisedPagesProtector from './components/authorisation/AuthorisedPagesProtector'
import Dashboard from './components/authorised pages/Dashboard'
import Home from './components/Home'
import MapApp from './components/learning/directions/map directions/MapApp'
import FlashcardApp from './components/learning/flashcards/FlashcardApp'

const App = () => {

  return (
    <div>
      <Router>
        <AuthProvider>
            <Routes>
              <Route path='/'>
              <Route index element={<Home />} />
                {/* Authorised routes: will redirect to login if not authorised */}
                <Route path='1/' element={<AuthorisedPagesProtector />}>
                  <Route index element={<Dashboard />} />
                  <Route path='flashcards' element={<FlashcardApp />} />
                  <Route path='map' element={<MapApp />} />
                </Route>
                {/* Un-authorised routes: no user login status checks required (public pages) */}
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
    </div>
  )
}

export default App
