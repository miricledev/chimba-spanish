import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight, FaBook, FaClone, FaNewspaper, FaMapSigns, FaCommentDots } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { CgAddR } from "react-icons/cg";
import axios from 'axios';
import { useAuth } from '../components/authorisation/AuthProvider';
import { countryInfo } from '../components/HomeComponents/storage/country';
import CourseSelect from './utilities/CourseSelect';


const Sideicon = ({ icon, link, label, collapsed }) => (
  <Link to={link} className='flex items-center gap-3 p-3 hover:bg-gray-200 rounded-xl w-full justify-center text-xl md:justify-start'>
    {icon}
    {!collapsed && <span className='text-xl font-carlito'>{label}</span>}
  </Link>
)

const LearnSidebar = () => {

  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? 64 : 280 // tailwind units: 16 vs 70

  const nav = useNavigate()

  const [courseIds, setCourseIds] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get('/api/get/user-course-ids', { params: { user_id: user.id } })
      .then((res) => {
        console.log(res.data.course_ids)
        setCourseIds(res.data.course_ids); // Example: [1, 3, 5]
      })
      .catch((err) => {
        console.error('Failed to fetch course IDs:', err);
      });
  }, [user]);

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div
        className={`fixed top-0 ml-100 left-0 h-screen bg-white border-r-2 flex flex-col justify-between items-center transition-all duration-300`}
        style={{ width: sidebarWidth }}
      >
        <div className='flex flex-col items-center gap-5 mt-10 w-full px-3'>
          {!collapsed && (
            <div className='flex flex-row border p-3 rounded-lg w-full justify-between items-center'>
              <h2 className='text-2xl font-bold font-carlito'>Course:</h2>



              <CourseSelect courseIds={courseIds} />



            </div>
          )}

          <Sideicon icon={<FaBook />} link='' label='Lessons' collapsed={collapsed} />
          <Sideicon icon={<FaClone />} link='flashcards' label='Flashcards' collapsed={collapsed} />
          <Sideicon icon={<FaNewspaper />} link='readingcomp' label='Articles' collapsed={collapsed} />
          <Sideicon icon={<FaMapSigns />} link='directions' label='Directions' collapsed={collapsed} />
          <Sideicon icon={<FaCommentDots />} link='slang' label='Slang wiki' collapsed={collapsed} />
        </div>

        {/* Toggle Button */}
        <div
          className='mb-5 cursor-pointer hover:scale-110 transition-transform'
          onClick={() => setCollapsed(prev => !prev)}
        >
          {collapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
        </div>
      </div>

      {/* Main content */}
      <div className='w-full' style={{ marginLeft: sidebarWidth }}>
        <Outlet />
      </div>
    </div>
  )
}

export default LearnSidebar
