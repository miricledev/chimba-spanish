import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaPlay, FaHeart, FaMagic, FaCloud } from 'react-icons/fa';
import { useAuth } from '../../authorisation/AuthProvider';

const colors = [
  'cyan', 'skyblue', 'violet', 'limegreen', 'gold', 'salmon', 'orchid', 'coral', 'turquoise'
];

const randomAngle = () => `${Math.floor(Math.random() * 360)}deg`;
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Roadmap = () => {

  const { selectedCourse} = useAuth()

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
      console.log('Selected course changed:', selectedCourse);
  }, [selectedCourse]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes] = await Promise.all([
          axios.post('/api/get/lessons', { course_id: selectedCourse })
        ]);
        setLessons(lessonsRes.data);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCourse]);

  const handleClick = (lesson) => {
    navigate(`${lesson.lesson_id}`, { state: { lesson } });
  };

  if (loading) return <p className="text-center py-10">Loading lessons...</p>;

  const positions = lessons.map((_, i) => {
    const offsetX = Math.sin(i * 1.2) * 320 + 420;
    const offsetY = i * 230 + 120;
    return { x: offsetX, y: offsetY };
  });

  // Floating clouds
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: Math.random() * 1800 + 100,
    left: Math.random() * 1000 + 100,
    size: Math.random() * 80 + 100,
    delay: Math.random() * 10,
  }));

  return (
    <div className="relative min-h-[2400px] overflow-hidden px-12 pt-12 bg-white">
      {/* Floating clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute bg-(--primary)/10 rounded-full  opacity-80 animate-cloud float-slow"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: cloud.size,
            height: cloud.size,
            animationDelay: `${cloud.delay}s`,
          }}
        ></div>
      ))}

      {/* Lessons */}
      {lessons.map((lesson, i) => {
        const pos = positions[i];
        const nextPos = positions[i + 1];
        const gradientAngle = randomAngle();
        const color = randomColor();

        return (
          <div key={lesson.lesson_id} className='w-250'>
            {/* Connector Path */}
            {nextPos && (
              <svg className="absolute z-0" style={{ left: 0, top: 0 }} width="100%" height="100%">
                <path
                  d={`M${pos.x + 60},${pos.y + 60} Q${(pos.x + nextPos.x) / 2},${(pos.y + nextPos.y) / 2 - 60} ${nextPos.x + 60},${nextPos.y + 60}`}
                  stroke="#ff7eb9"
                  fill="transparent"
                  strokeWidth="4"
                  strokeDasharray="10 6"
                />
              </svg>
            )}

            {/* Bubble with Gradient */}
            <div
              onClick={() => handleClick(lesson)}
              className="absolute z-10 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            >
              {/* Title Bubble */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-pink-100 border border-pink-300 px-5 py-1.5 rounded-full shadow-md text-pink-800 font-semibold text-sm whitespace-nowrap">
                {lesson.title}
              </div>

              {/* Play Bubble */}
              <div
                className="w-32 h-32 rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-white text-4xl relative"
                style={{
                  background: `linear-gradient(${gradientAngle}, var(--primary), ${color})`,
                }}
              >
                <FaPlay />
                <FaStar className="absolute top-2 left-2 text-white/60 animate-spin-slow" />
              </div>
            </div>
          </div>
        );
      })}

      {/* Motivational Footer */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xl text-pink-800 animate-pulse flex items-center gap-2 z-20">
        <FaHeart className="text-red-500" /> Keep going, you're doing amazing! <FaMagic className="text-purple-500" />
      </div>

      {/* Cloud animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateX(0px); }
            50% { transform: translateX(30px); }
            100% { transform: translateX(0px); }
          }
          .animate-cloud {
            animation: float 30s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Roadmap;
