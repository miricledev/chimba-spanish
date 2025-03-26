import React, { useState } from 'react';
import ViewProfileCard from './ViewProfileCard';
import EditProfileForm from './EditProfilePage';

const ViewProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Rohan Kumar',
    email: 'rohan13k@outlook.com',
    role: 'Software Engineer'
  });

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleSave = (updatedData) => {
    setUser(updatedData);
    setEditing(false);
  };

  return editing ? (
    <div className='flex flex-row items-center justify-center gap-5'>
      <ViewProfileCard user={user} onEdit={handleEdit} />
      <EditProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
    </div>
    
  ) : (
    <ViewProfileCard user={user} onEdit={handleEdit} />
  );
};

export default ViewProfilePage;
