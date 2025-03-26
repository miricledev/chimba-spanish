import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; // or any icon you prefer
import { countryInfo } from '/src/components/HomeComponents/storage/country';

const CourseSelect = ({ courseIds }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const nav = useNavigate();

  const enrolledCourses = countryInfo.filter(course =>
    courseIds.includes(course.id)
  );

  const handleSelect = (id) => {
    setSelectedId(id);
    setIsOpen(false);
    console.log("Selected course id:", id);
  };

  const handleAddNew = () => {
    nav('/1/learn/select');
  };

  return (
    <div className="relative inline-block w-64">
      {/* Trigger Button */}
      <div
        className=" rounded p-2 bg-white flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedId ? (
          <div className="flex items-center gap-2">
            <img
              src={enrolledCourses.find(c => c.id === selectedId)?.image}
              className="w-6 h-4 object-cover rounded"
              alt="flag"
            />
            <span>{enrolledCourses.find(c => c.id === selectedId)?.country}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select course</span>
        )}
        <span>▼</span>
      </div>

      {/* Dropdown Content */}
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

          {/* Add New Option */}
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
