import React from 'react'
import Register from './components/registration/Register'
import Login from './components/login/Login'
import AuthProvider from './components/authorisation/AuthProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AuthorisedPagesProtector from './components/authorisation/AuthorisedPagesProtector'
import Dashboard from './components/authorised pages/Dashboard'
import Home from './components/Home'
import MapApp from './components/learning/directions/MapApp'
import FlashcardApp from './components/learning/flashcards/FlashcardApp'
import AIChatInterface from './components/learning/AI Chat/AIChatInterface'
import ReadingComp from './components/learning/Comprehension/ReadingComp'
import FindUsers from './components/chats/FindUsers'
import ChatInterface from './components/chats/ChatInterface'
import Inbox from './components/chats/Inbox'

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
                  <Route path='aichat' element={<AIChatInterface />} />
                  <Route path='readingcomp' element={<ReadingComp />} />
                  <Route path='findusers' element={<FindUsers />} />
                  <Route path='chats/:id1/:id2' element={<ChatInterface />} />
                  <Route path='inbox' element={<Inbox />} />
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
