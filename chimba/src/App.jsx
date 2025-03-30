import React from 'react'
import Register from './components/registration/Register'
import Login from './components/login/Login'
import AuthProvider from './components/authorisation/AuthProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthorisedPagesProtector from './navbars/AuthorisedPagesProtector'
import Dashboard from './components/authorised pages/Dashboard'
import Home from './components/HomeComponents/Home'
import FlashcardApp from './components/learning/flashcards/FlashcardApp'
import AIChatInterface from './components/learning/AI Chat/AIChatInterface'
import ReadingComp from './components/learning/Comprehension/ReadingComp'
import FindUsers from './components/chats/FindUsers'
import ChatInterface from './components/chats/ChatInterface'
import Inbox from './components/chats/Inbox'
import FreeNav from './navbars/FreeNav'
import './App.css'
import Sidebar from './navbars/Sidebar'
import SocialBar from './navbars/SocialBar'
import LearnSidebar from './navbars/LearnSidebar'
import Roadmap from './components/learning/Lessons/Roadmap'
import FlashcardNav from './navbars/FlashcardNav'
import AddFC from './components/learning/flashcards/AddFC'
import ViewProfilePage from './components/profile/ViewProfilePage'
import EditProfilePage from './components/profile/EditProfilePage'
import DialectSelector from './components/courses/DialectSelector'
import { useAuth } from './components/authorisation/AuthProvider'
import TeacherSidebar from './components/teacher/nav/TeacherSidebar'
import MyLessons from './components/teacher/components/MyLessons'
import CreateLesson from './components/teacher/components/CreateLesson'
import QuizRenderer from './components/teacher/components/QuizRenderer'
import { dummyQuiz } from './components/teacher/components/temp/dummyQuiz'

const InnerApp = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path='/'>
        {/* Student Routes */}
        {user && user.account_type === 1 && (
          <Route path='1/' element={<AuthorisedPagesProtector />}>
            <Route index element={<Dashboard />} />
            <Route path='learn' element={<LearnSidebar />}>
              <Route index element={<Roadmap />} />
              <Route path='select' element={<DialectSelector />} />
              <Route path='flashcards' element={<FlashcardNav />}>
                <Route index element={<FlashcardApp />} />
                <Route path='add' element={<AddFC />} />
              </Route>
              <Route path='readingcomp' element={<ReadingComp />} />
            </Route>
            <Route path='aichat' element={<AIChatInterface />} />
            <Route path='social' element={<SocialBar />}>
              <Route index element={<FindUsers />} />
              <Route path='inbox'>
                <Route index element={<Inbox />} />
                <Route path='chats/:id1/:id2' element={<Inbox />} />
              </Route>
            </Route>
            <Route path='profile' element={<ViewProfilePage />} />
          </Route>
        )}

        {/* Teacher Routes */}
        {user && user.account_type === 2 && (
          <Route path='2/' element={<TeacherSidebar />}>
            <Route index element={<Dashboard />} /> {/* Replace with TeacherDashboard */}
            <Route path='profile' element={<ViewProfilePage />} />
            <Route path='my-lessons' element={<MyLessons />} />
            <Route path='create-lesson' element={<CreateLesson />} />
            <Route path="quiz-test" element={<QuizRenderer quiz={dummyQuiz} />} />

          </Route>
        )}

        {/* Public Routes */}
        <Route path='/' element={<Sidebar />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>

        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <div>
      <Router>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App;
