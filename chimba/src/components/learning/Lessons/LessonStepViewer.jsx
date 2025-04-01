import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaVolumeUp } from 'react-icons/fa';
import QuizRenderer from '../../teacher/components/QuizRenderer';
import { ConversationPreview } from '../../teacher/components/ConversationPreview';
import MatchingGame from '../../teacher/components/utilities/MatchingGame';

const LessonStepViewer = ({ lesson, show, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmClose, setConfirmClose] = useState(false);
  const [vocabReviewed, setVocabReviewed] = useState(false);

  const sections = [
    'video',
    'audio',
    'dialogue',
    'vocabulary',
    'matchingGame',
    'culturalNote',
    'writtenExercise',
    'quiz',
  ];

  useEffect(() => {
    if (!show) setCurrentStep(0);
  }, [show]);

  const nextStep = () => {
    // Prevent navigating to matchingGame if vocab not reviewed
    if (sections[currentStep] === 'vocabulary') setVocabReviewed(true);
    if (sections[currentStep + 1] === 'matchingGame' && !vocabReviewed) return;
    setCurrentStep((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const sectionStyle = 'bg-white/90 p-6 rounded-xl shadow-lg';

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-419';
    speechSynthesis.speak(utterance);
  };

  const renderCurrentStep = () => {
    const section = sections[currentStep];

    switch (section) {
      case 'video':
        return lesson.video_url && (
          <div className={sectionStyle}>
            <h2 className="text-2xl font-semibold mb-4">📺 Video</h2>
            <iframe
              src={lesson.video_url.replace('watch?v=', 'embed/')}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
            />
          </div>
        );

      case 'audio':
        return lesson.audio_url && (
          <div className={sectionStyle}>
            <h2 className="text-2xl font-semibold mb-4">🔊 Audio</h2>
            <audio controls src={lesson.audio_url} className="w-full" />
          </div>
        );

      case 'dialogue':
        return (
          <div className={sectionStyle}>
            <h2 className="text-2xl font-semibold mb-4">💬 Conversación</h2>
            <ConversationPreview dialogue={lesson.dialogue} />
          </div>
        );

      case 'vocabulary':
        return (
          <div className={sectionStyle}>
            <h2 className="text-2xl font-semibold mb-4">📚 Vocabulario</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {lesson.vocabulary.map((item, i) => (
                <div key={i} className="bg-pink-50 border-l-4 border-(--primary) p-3 rounded shadow flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{item.term}</p>
                    <p className="text-gray-600">{item.meaning}</p>
                  </div>
                  <button onClick={() => speak(item.term)} className="text-(--primary) hover:text-pink-600">
                    <FaVolumeUp />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matchingGame':
        return (
          <div className={sectionStyle}>
            <h2 className="text-2xl font-semibold mb-4">🎯 Repaso</h2>
            <MatchingGame pairs={lesson.vocabulary} />
          </div>
        );

      case 'culturalNote':
        return (
          <div className={`${sectionStyle} bg-yellow-50 w-100 ml-[38%] border-l-4 border-yellow-400`}>
            <h2 className="text-2xl font-semibold mb-4">🧠 Nota cultural</h2>
            <p className="text-gray-700">{lesson.cultural_note}</p>
          </div>
        );

      case 'writtenExercise':
        return (
          <div className={`${sectionStyle} bg-blue-50 border-l-4 border-blue-400`}>
            <h2 className="text-2xl font-semibold mb-4">✍️ Ejercicio escrito</h2>
            <p className="text-gray-700">{lesson.written_exercise}</p>
          </div>
        );

      case 'quiz':
        return (
          <div className={sectionStyle}>
            <h2 className="text-2xl font-semibold mb-4">🧪 Quiz</h2>
            <QuizRenderer quiz={lesson.quiz} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 w-[90vw] h-[90vh] overflow-y-auto relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Close Button */}
            <button
              className="absolute cursor-pointer top-4 right-4 text-xl text-gray-600 hover:text-red-500"
              onClick={() => setConfirmClose(true)}
            >
              <FaTimes />
            </button>

            {/* Lesson Metadata */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-(--primary)">{lesson.title}</h1>
              <p className="text-gray-600">Nivel: {lesson.level} | Sección: {lesson.section}</p>
              <p className="text-lg mt-1">🎯 <strong>Objetivo:</strong> {lesson.objective}</p>
            </div>

            {renderCurrentStep()}

            {/* Navigation */}
            <div className="mt-6 flex justify-center">
              {currentStep < sections.length - 1 && (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r cursor-pointer from-(--primary) to-pink-400 hover:from-pink-500 hover:to-(--primary) text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transition"
                >
                  ➡️ Siguiente
                </button>
              )}
              {currentStep === sections.length - 1 && (
                <div className="text-green-600 font-semibold text-xl">🎉 ¡Fin de la lección!</div>
              )}
            </div>
          </motion.div>

          {/* Confirm Close Dialog */}
          {confirmClose && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
                <p className="text-lg font-semibold mb-4">¿Estás seguro de que quieres salir de la lección?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setConfirmClose(false);
                      onClose();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition"
                  >
                    Sí, cerrar
                  </button>
                  <button
                    onClick={() => setConfirmClose(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LessonStepViewer;