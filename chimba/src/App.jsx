import React from 'react'
import Register from './components/registration/Register'
import Login from './components/login/Login'
import AuthProvider from './components/authorisation/AuthProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthorisedPagesProtector from './components/navbars/AuthorisedPagesProtector'
import Dashboard from './components/authorised pages/Dashboard'
import Home from './components/HomeComponents/Home'
import FlashcardApp from './components/learning/flashcards/FlashcardApp'
import AIChatInterface from './components/learning/AI Chat/AIChatInterface'
import ReadingComp from './components/learning/Comprehension/ReadingComp'
import FindUsers from './components/chats/FindUsers'
import ChatInterface from './components/chats/ChatInterface'
import Inbox from './components/chats/Inbox'
import FreeNav from './components/navbars/FreeNav'
import './App.css'
import Sidebar from './components/navbars/Sidebar'

const App = () => {

  return (
    <div>
      <Router>
        <AuthProvider>
            <Routes>
              <Route path='/'>
                
                {/* Authorised routes: will redirect to login if not authorised */}
                <Route path='1/' element={<AuthorisedPagesProtector />}>
                  <Route index element={<Dashboard />} />
                  <Route path='flashcards' element={<FlashcardApp />} />
                  <Route path='aichat' element={<AIChatInterface />} />
                  <Route path='readingcomp' element={<ReadingComp />} />
                  <Route path='findusers' element={<FindUsers />} />
                  <Route path='chats/:id1/:id2' element={<ChatInterface />} />
                  <Route path='inbox' element={<Inbox />} />
                </Route>
                {/* Un-authorised routes: no user login status checks required (public pages) */}
                <Route path='/' element={<Sidebar />}>
                  <Route path='login' element={<Login />} />
                  <Route path='register' element={<Register />} />
                </Route>
                <Route index element={<Home />} />
              </Route>
            </Routes>
          </AuthProvider>
        </Router>
    </div>
  )
}

export default App