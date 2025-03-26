import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const mockGraphData = [
  { week: 'Week 1', words: 50 },
  { week: 'Week 2', words: 90 },
  { week: 'Week 3', words: 130 },
  { week: 'Week 4', words: 180 },
];

const ViewProfileCard = ({ user, onEdit }) => {
  return (
    <div className="w-200 mx-auto p-8 bg-white shadow-lg rounded-xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[var(--primary)]">My Profile</h2>
        <button
          onClick={onEdit}
          className="text-sm text-white bg-[var(--primary)] px-4 py-2 rounded hover:opacity-90 transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Picture + Basic Info */}
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-6xl">
          <FaUserCircle />
        </div>
        <div className="space-y-1">
          <p className="text-xl font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{user.role}</p>
        </div>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--primary)] mb-1">Bio</h3>
        <p className="text-gray-700">{user.bio}</p>
      </div>

      {/* Dialects */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--primary)] mb-1">Dialects Learning</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Paisa</li>
          <li>Mexican Spanish</li>
          <li>Argentinian Lunfardo</li>
        </ul>
      </div>

      {/* Graph */}
      <div>
        <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">Words Learned Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={mockGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="words" stroke="var(--primary)" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ViewProfileCard;
