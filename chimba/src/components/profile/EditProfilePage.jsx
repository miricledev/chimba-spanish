import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const EditProfilePage = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl space-y-6"
    >
      <h2 className="text-3xl font-bold text-[var(--primary)]">Edit Profile</h2>

      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-6xl">
          <FaUserCircle />
        </div>
        <p className="text-gray-600 text-sm">Profile picture upload coming soon...</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:opacity-90 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditProfilePage;
