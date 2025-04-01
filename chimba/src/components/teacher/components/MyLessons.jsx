import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LessonCard from './LessonCard';
import CreateLesson from './CreateLesson';
import { useAuth } from '../../authorisation/AuthProvider';

const sectionLookup = {
  1: 'Food & Drink',
  2: 'Small Talk',
  3: 'Greetings',
  4: 'Daily Life',
  5: 'Travel',
  // Add more as needed
};

const levelOptions = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const MyLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [filterLevel, setFilterLevel] = useState('All');

  const [sectionLookup, setSectionLookup] = useState({});

  const { selectedCourse } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, sectionsRes] = await Promise.all([
          axios.post('/api/get/lessons', { course_id: selectedCourse }),
          axios.get('/api/get/sections'),
        ]);

        setLessons(lessonsRes.data);
        setSectionLookup(sectionsRes.data);
      } catch (err) {
        console.error('Error fetching lessons/sections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`/api/delete/lesson/${lessonId}`);
      setLessons(prev => prev.filter(lesson => lesson.lesson_id !== lessonId));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      alert('❌ Error deleting lesson. Check console.');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const groupedBySection = lessons.reduce((acc, lesson) => {
    const { section_id } = lesson;
    if (!acc[section_id]) acc[section_id] = [];
    acc[section_id].push(lesson);
    return acc;
  }, {});

  const filteredLessons = (lessonArray) =>
    filterLevel === 'All'
      ? lessonArray
      : lessonArray.filter((l) => l.level === filterLevel);

  if (loading) return <p className="text-center text-lg">Loading lessons...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📚 My Lessons</h1>
      <p className="mb-6 text-gray-600">Organize and manage your uploaded lessons.</p>

      <div className="mb-6">
        <label className="font-medium mr-2">Filter by level:</label>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          {levelOptions.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

      {selectedLesson ? (
        <div className="border-2 rounded-xl shadow-lg p-4 bg-white">
          <button
            onClick={() => setSelectedLesson(null)}
            className="mb-4 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
          >
            ← Back to all lessons
          </button>
          <CreateLesson previewData={selectedLesson} />
        </div>
      ) : (
        Object.entries(groupedBySection).map(([sectionId, sectionLessons]) => (
          <div key={sectionId} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer bg-(--primary-light) px-4 py-2 rounded-md"
              onClick={() => toggleSection(sectionId)}
            >
              <h2 className="text-xl font-bold text-(--primary)">
                {sectionLookup[sectionId] || 'Unknown Section'}
              </h2>
              <span className="text-sm text-gray-600">
                {expandedSections[sectionId] ? '➖ Hide' : '➕ Show'}
              </span>
            </div>

            {expandedSections[sectionId] && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLessons(sectionLessons).map((lesson) => (
                  <LessonCard
                    key={lesson.lesson_id}
                    lesson={lesson}
                    onView={() => setSelectedLesson(lesson)}
                    onDelete={handleDeleteLesson}
                  />
                ))}

                {filteredLessons(sectionLessons).length === 0 && (
                  <p className="text-gray-500 italic col-span-full">
                    No lessons match this filter.
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyLessons;
