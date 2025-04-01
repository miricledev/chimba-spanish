import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LessonStepViewer from './LessonStepViewer';

const LessonViewer = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const lesson = state?.lesson;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (lesson) {
      setShowModal(true);
    }
  }, [lesson]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      navigate('/1/learn');
    }, 300); // Delay to allow animation to finish
  };

  if (!lesson) {
    return <p className="text-center py-10 text-red-500">Lesson not found. (No data passed)</p>;
  }

  return (
    <>
      <LessonStepViewer
        show={showModal}
        lesson={lesson}
        onClose={handleClose}
      />
    </>
  );
};

export default LessonViewer;
