import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { countryInfo } from '/src/components/HomeComponents/storage/country';
import { useAuth } from '/src/components/authorisation/AuthProvider'; // ⬅️ import context

const CourseSelect = ({ courseIds }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCourse, selectCourse } = useAuth(); // ⬅️ get from context
  const nav = useNavigate();

  const enrolledCourses = countryInfo.filter(course =>
    courseIds.includes(course.id)
  );

  const handleSelect = (id) => {
    selectCourse(id); // ⬅️ set it globally
    setIsOpen(false);
  };

  const handleAddNew = () => {
    nav('/1/learn/select');
  };

  return (
    <div className="relative inline-block w-64">
      <div
        className="rounded p-2 bg-white flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCourse ? (
          <div className="flex items-center gap-2">
            <img
              src={enrolledCourses.find(c => c.id === selectedCourse)?.image}
              className="w-6 h-4 object-cover rounded"
              alt="flag"
            />
            <span>{enrolledCourses.find(c => c.id === selectedCourse)?.country}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select course</span>
        )}
        <span>▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleSelect(course.id)}
              className="p-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={course.image}
                className="w-6 h-4 object-cover rounded"
                alt={course.country}
              />
              <span>{course.country}</span>
            </div>
          ))}

          <div
            onClick={handleAddNew}
            className="p-2 flex items-center gap-2 text-[var(--primary)] hover:bg-gray-100 cursor-pointer border-t"
          >
            <FaPlus className="text-sm" />
            <span>Add new dialect</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSelect;
