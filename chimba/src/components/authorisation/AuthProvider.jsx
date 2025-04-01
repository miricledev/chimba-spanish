import React, { useContext, useState, createContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacherId, setTeacherId] = useState(null); // ⬅️ NEW

  useEffect(() => {
    const storedUser = localStorage.getItem('chimbaUser');
    const storedCourse = localStorage.getItem('selectedCourse');
    const storedTeacherId = localStorage.getItem('teacherId');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCourse) setSelectedCourse(JSON.parse(storedCourse));
    if (storedTeacherId) setTeacherId(JSON.parse(storedTeacherId));

    setLoading(false);
  }, []);

  const login = async (userDetails) => {
    setUser(userDetails);
    localStorage.setItem('chimbaUser', JSON.stringify(userDetails));

    try {
      const res = await axios.post('/api/get/teacher-course', {
        user_id: userDetails.id,
      });

      const { course_id, teacher_id } = res.data;
      console.log(course_id)
      console.log(teacher_id)

      if (course_id) {
        
        setSelectedCourse(course_id);
        localStorage.setItem('selectedCourse', JSON.stringify(course_id));
      }

      if (teacher_id) {
        
        setTeacherId(teacher_id);
        localStorage.setItem('teacherId', JSON.stringify(teacher_id));
      }
    } catch (err) {
      console.error('Error checking teacher status:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedCourse(null);
    setTeacherId(null);

    localStorage.removeItem('chimbaUser');
    localStorage.removeItem('selectedCourse');
    localStorage.removeItem('teacherId');

    navigate('/login');
  };

  const selectCourse = (courseId) => {
    setSelectedCourse(courseId);
    localStorage.setItem('selectedCourse', JSON.stringify(courseId));
  };

  const redirectIfNotLoggedIn = () => {
    const storedUser = localStorage.getItem('chimbaUser');
    if (!storedUser) {
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        selectedCourse,
        teacherId, // ⬅️ make available in context
        selectCourse,
        redirectIfNotLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
