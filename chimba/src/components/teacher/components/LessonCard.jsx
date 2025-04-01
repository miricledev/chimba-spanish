import React from 'react';
import { FaTrashAlt, FaEye } from 'react-icons/fa';

const LessonCard = ({ lesson, onView, onDelete }) => {
  return (
    <div className="border rounded-lg shadow p-4 bg-white relative">
      <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
      <p className="text-sm text-gray-600 mb-1">🎯 {lesson.objective}</p>
      <p className="text-sm text-gray-500">Level: {lesson.level}</p>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <FaEye /> View Lesson
        </button>

        <button
          onClick={() => onDelete(lesson.lesson_id)}
          className="text-red-500 hover:text-red-700"
          title="Delete this lesson"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default LessonCard;
