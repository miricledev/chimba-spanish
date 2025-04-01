import React, { useState } from 'react';
import CreateLessonQuiz from './CreateLessonQuiz';
import { v4 as uuidv4 } from 'uuid';
import { FaTrashAlt, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import QuizRenderer from './QuizRenderer';
import MatchingGame from './utilities/MatchingGame';
import axios from 'axios';
import { useAuth } from '../../authorisation/AuthProvider'
import { ConversationPreview } from './ConversationPreview';


const dummyLessonData = {
  title: 'Lunfardo Intermedio: El bondi, la guita y más 🚍💸',
  level: 'C1',
  section: 'Urban Life & Colloquialisms',
  objective: 'Comprehend deeper Lunfardo expressions tied to city life, money, and public transport.',
  videoURL: 'https://www.youtube.com/embed/avJL8Hw2mFE',
  audioURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  dialogue: [
    { id: '1', type: 'message', speaker: 'A', text: 'Hoy el bondi venía hasta las manos. No entraba un alfiler.' },
    { id: '2', type: 'message', speaker: 'B', text: '¡Ni me digas! Encima justo no tenía saldo en la SUBE y tuve que garpar con monedas.' },
    { id: '3', type: 'question', text: '¿Qué significa "garpar"?',
      options: ['Cantar', 'Pagar', 'Molestar', 'Tirar'], correctOption: 1 },
    { id: '4', type: 'message', speaker: 'A', text: 'Y sí, todo por ahorrar un mango. Estoy en la lona.' },
    { id: '5', type: 'question', text: '¿Qué quiere decir "estar en la lona"?',
      options: ['Estar deprimido', 'Estar sin dinero', 'Estar enamorado', 'Estar de vacaciones'], correctOption: 1 },
    { id: '6', type: 'message', speaker: 'B', text: 'Te entiendo. Yo también estoy con la soga al cuello este mes.' },
    { id: '7', type: 'message', speaker: 'A', text: 'Pero bueno, al menos llegué al laburo sin que me pique el guarda.' },
    { id: '8', type: 'question', text: '¿Qué significa "me pique el guarda"?',
      options: ['Que me hable', 'Que me vea sin pagar', 'Que me cobre de más', 'Que me eche del bondi'], correctOption: 1 },
    { id: '9', type: 'message', speaker: 'B', text: 'Jajaja, ¡zafaste! Eso sí que es tener suerte.' }
  ],
  vocabulary: [
    { term: 'Bondi', meaning: 'Colectivo (autobús)' },
    { term: 'Garpar', meaning: 'Pagar (informal)' },
    { term: 'Estar en la lona', meaning: 'Estar sin dinero' },
    { term: 'Mango', meaning: 'Dinero (informal)' },
    { term: 'Guarda', meaning: 'Revisor del colectivo' }
  ],
  culturalNote: 'Lunfardo sigue vivo en la jerga urbana de Buenos Aires. Muchos términos aparecen incluso en canciones de tango y trap argentino. El transporte público y la economía diaria son temas comunes donde el lunfardo florece.',
  writtenExercise: 'Escribí una mini historia sobre un día complicado usando al menos cuatro palabras de lunfardo de esta lección.',
  quiz: [
    {
      id: 'q1', type: 'translate_es',
      question: 'Translate to Spanish: "I had no money left."',
      correctAnswer: 'Estaba en la lona.'
    },
    {
      id: 'q2', type: 'true_false',
      question: 'Bondi es una forma informal de decir “auto”.',
      correctAnswer: false
    },
    {
      id: 'q3', type: 'fill_blank',
      question: 'Tuve que ______ con monedas.',
      correctAnswer: 'garpar'
    },
    {
      id: 'q4', type: 'word_blocks',
      question: 'Reorganiza la frase:',
      correctAnswer: 'Estoy en la lona.',
      blocks: ['Estoy', 'en', 'la', 'lona.']
    },
    {
      id: 'q5', type: 'translate_en',
      question: 'Traduce al inglés: "El guarda me picó."',
      correctAnswer: 'The inspector saw me.'
    },
    {
      id: 'q6', type: 'audio_type',
      question: 'Escuchá y escribí lo que oís.',
      correctAnswer: 'No tenía un mango.',
      audioURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
    },
    {
      id: 'q7', type: 'true_false',
      question: '“Mango” significa fruta en el lunfardo.',
      correctAnswer: false
    },
    {
      id: 'q8', type: 'matching_pairs',
      question: 'Relacioná las expresiones con su significado:',
      pairs: [
        { left: 'Garpar', right: 'Pagar' },
        { left: 'Bondi', right: 'Colectivo' },
        { left: 'Estar en la lona', right: 'Sin plata' },
        { left: 'Guarda', right: 'Inspector del bus' }
      ]
    }
  ]
};





// Dialogue Editor Component
const DialogueEditor = ({ dialogue, setDialogue }) => {
  const [newDialogue, setNewDialogue] = useState({ 
    type: 'message', 
    speaker: 'A', 
    text: '' 
  });
  
  // For multiple choice questions
  const [newQuestion, setNewQuestion] = useState({
    type: 'question',
    text: '',
    options: ['', '', '', ''],
    correctOption: 0
  });
  
  // Toggle between message and question inputs
  const [inputType, setInputType] = useState('message');

  const addDialogue = () => {
    if (inputType === 'message' && newDialogue.text.trim()) {
      setDialogue([
        ...dialogue,
        { ...newDialogue, id: uuidv4() }
      ]);
      setNewDialogue({ type: 'message', speaker: 'A', text: '' });
    } else if (inputType === 'question' && 
               newQuestion.text.trim() && 
               newQuestion.options.every(opt => opt.trim())) {
      setDialogue([
        ...dialogue,
        { ...newQuestion, id: uuidv4() }
      ]);
      setNewQuestion({
        type: 'question',
        text: '',
        options: ['', '', '', ''],
        correctOption: 0
      });
    }
  };

  const removeDialogue = (id) => {
    setDialogue(dialogue.filter(item => item.id !== id));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setInputType('message')}
          className={`px-3 py-1 rounded-md ${
            inputType === 'message' 
              ? 'bg-(--primary) text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          💬 Message
        </button>
        <button
          type="button"
          onClick={() => setInputType('question')}
          className={`px-3 py-1 rounded-md ${
            inputType === 'question' 
              ? 'bg-(--primary) text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          ❓ Question
        </button>
      </div>

      {inputType === 'message' ? (
        <div className="flex gap-2 mb-2">
          <select 
            value={newDialogue.speaker} 
            onChange={(e) => setNewDialogue({ ...newDialogue, speaker: e.target.value })} 
            className="border rounded-md px-3 py-2"
          >
            <option value="A">Person A</option>
            <option value="B">Person B</option>
          </select>
          <input
            type="text"
            value={newDialogue.text}
            onChange={(e) => setNewDialogue({ ...newDialogue, text: e.target.value })}
            className="flex-1 border rounded-md px-3 py-2"
            placeholder="Enter dialogue line..."
          />
          <button 
            type="button" 
            onClick={addDialogue} 
            className="bg-(--primary) text-white px-4 py-2 rounded-md hover:brightness-90"
          >
            ➕
          </button>
        </div>
      ) : (
        <div className="space-y-2 p-4 border rounded-md bg-gray-50">
          <input
            type="text"
            value={newQuestion.text}
            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Enter question..."
          />
          
          <p className="font-medium mt-2">Options (select the correct one):</p>
          
          {newQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctOption"
                checked={newQuestion.correctOption === index}
                onChange={() => setNewQuestion({ ...newQuestion, correctOption: index })}
                className="h-4 w-4 text-(--primary)"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addDialogue} 
            className="mt-2 w-full bg-(--primary) text-white px-4 py-2 rounded-md hover:brightness-90"
          >
            Add Question
          </button>
        </div>
      )}

      <div className="border rounded-md p-4 bg-gray-50 space-y-2 max-h-60 overflow-auto mt-4">
        {dialogue.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            {item.type === 'message' ? (
              <div className={`max-w-[70%] px-4 py-2 rounded-xl text-white ${
                item.speaker === 'A' ? 'bg-(--primary)' : 'bg-gray-400 ml-auto'
              }`}>
                <strong>{item.speaker}:</strong> {item.text}
              </div>
            ) : (
              <div className="w-full p-3 bg-yellow-100 rounded-xl border border-yellow-300">
                <p className="font-medium text-gray-800">❓ {item.text}</p>
                <div className="ml-4 mt-1 text-sm text-gray-600">
                  <p>Options: {item.options.map((opt, i) => 
                    <span key={i} className={i === item.correctOption ? 'font-bold' : ''}>
                      {i+1}. {opt}{i < item.options.length-1 ? ' | ' : ''}
                    </span>
                  )}</p>
                </div>
              </div>
            )}
            <button 
              type="button" 
              onClick={() => removeDialogue(item.id)} 
              className="text-red-500 hover:text-red-700 focus:outline-none ml-2"
              title="Delete item"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const CreateLesson = () => {
  const [lessonData, setLessonData] = useState(dummyLessonData);
  const [previewMode, setPreviewMode] = useState(false);
  const [newVocab, setNewVocab] = useState({ term: '', meaning: '' });
  const [showMatching, setShowMatching] = useState(false);

  const { teacherId, selectedCourse } = useAuth()

  const submitLessonToBackend = async () => {
    try {
      const response = await axios.post('/api/set/lesson', {
        lesson: lessonData,
        teacherId: teacherId,   // replace with actual teacherId from auth context or props
        courseId: selectedCourse     // replace with actual courseId from course selector
      });
  
      console.log(response.data.reply);
      alert('✅ Lesson saved successfully!');
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('❌ Error saving lesson. Check console.');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData({ ...lessonData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Lesson Submitted:", lessonData);
  };

  const togglePreview = () => setPreviewMode(!previewMode);

  const addVocabulary = () => {
    if (newVocab.term && newVocab.meaning) {
      setLessonData({
        ...lessonData,
        vocabulary: [...lessonData.vocabulary, { ...newVocab, id: uuidv4() }]
      });
      setNewVocab({ term: '', meaning: '' });
    }
  };

  const removeVocab = (id) => {
    setLessonData({
      ...lessonData,
      vocabulary: lessonData.vocabulary.filter(v => v.id !== id)
    });
  };

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const sections = ['Greetings', 'Food & Drink', 'Small Talk', 'Daily Life', 'Travel'];

  return (
    <div className="flex flex-col justify-center items-center w-full ml-10 mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-(--primary)">
        {previewMode ? '👀 Lesson Preview' : '🧠 Create a New Lesson'}
      </h1>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={togglePreview}
          className="text-sm font-medium px-4 py-2 bg-(--primary) text-white rounded-md hover:brightness-90 transition"
        >
          {previewMode ? '🔧 Edit Lesson' : '👁️ Preview Lesson'}
        </button>
      </div>

      {!previewMode ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

          <div className="col-span-2">
            <label className="font-semibold mb-1 block">Title</label>
            <input name="title" value={lessonData.title} onChange={handleChange} required className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="font-semibold mb-1 block">Level</label>
            <select name="level" value={lessonData.level} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="font-semibold mb-1 block">Section</label>
            <select name="section" value={lessonData.section} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="font-semibold mb-1 block">Objective</label>
            <textarea name="objective" value={lessonData.objective} onChange={handleChange} className="w-full border rounded-md px-3 py-2" rows={2} />
          </div>

          <div>
            <label className="font-semibold mb-1 block">Video URL</label>
            <input name="videoURL" value={lessonData.videoURL} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="font-semibold mb-1 block">Audio URL</label>
            <input name="audioURL" value={lessonData.audioURL} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
          </div>

          <div className="col-span-2">
            <label className="font-semibold mb-1 block">Dialogue & Questions</label>
            {previewMode ? (
              <ConversationPreview dialogue={lessonData.dialogue} />
            ) : (
              <DialogueEditor 
                dialogue={lessonData.dialogue} 
                setDialogue={(newDialogue) => setLessonData({ ...lessonData, dialogue: newDialogue })}
              />
            )}
          </div>

          <div className="col-span-2">
            <label className="font-semibold mb-1 block">Vocabulary</label>
            <div className="flex gap-2 mb-2">
              <input name="term" value={newVocab.term} onChange={(e) => setNewVocab({ ...newVocab, term: e.target.value })} placeholder="Term" className="border rounded-md px-3 py-2 w-1/2" />
              <input name="meaning" value={newVocab.meaning} onChange={(e) => setNewVocab({ ...newVocab, meaning: e.target.value })} placeholder="Meaning" className="border rounded-md px-3 py-2 w-1/2" />
              <button type="button" onClick={addVocabulary} className="bg-(--primary) text-white px-4 py-2 rounded-md hover:brightness-90">➕</button>
            </div>
            <ul className="list-disc ml-6 space-y-1">
              {lessonData.vocabulary.map((v, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <strong>{v.term}</strong>: {v.meaning}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeVocab(v.id)} 
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    title="Delete vocabulary item"
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <label className="font-semibold mb-1 block">Cultural Note</label>
            <textarea name="culturalNote" value={lessonData.culturalNote} onChange={handleChange} rows={3} className="w-full border rounded-md px-3 py-2" placeholder="Explain any cultural insights or local expressions" />
          </div>

          <div className="col-span-2">
            <label className="font-semibold mb-1 block">Written Exercise</label>
            <textarea name="writtenExercise" value={lessonData.writtenExercise} onChange={handleChange} rows={3} className="w-full border rounded-md px-3 py-2" placeholder="Ask students to write their own scene or practice something" />
          </div>

          <div className="col-span-2">
            <CreateLessonQuiz onQuizChange={(quizArray) => setLessonData({ ...lessonData, quiz: quizArray })} />
          </div>

          <div className="col-span-2 flex justify-center">
            <button onClick={submitLessonToBackend} className="bg-(--primary) cursor-pointer text-white font-semibold py-3 px-6 rounded-md hover:brightness-90 transition duration-200">
              🚀 Publish Lesson
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          <h2 className="text-4xl font-bold text-(--primary)">{lessonData.title}</h2>
          <p className="text-sm text-gray-500 italic">Level: {lessonData.level} | Section: {lessonData.section}</p>
          <p className="text-xl">🎯 <strong>Objective:</strong> {lessonData.objective}</p>

          {lessonData.videoURL && (
            <div>
              <h3 className="font-semibold text-2xl mb-2">📺 Video</h3>
              <iframe src={lessonData.videoURL.replace('watch?v=', 'embed/')} className="w-full aspect-video rounded-md" allowFullScreen />
            </div>
          )}

          {lessonData.audioURL && (
            <div>
              <h3 className="font-semibold text-2xl mb-2">🔊 Audio</h3>
              <audio controls src={lessonData.audioURL} className="w-full" />
            </div>
          )}

          <div>
            <h3 className="font-semibold text-2xl mb-2">💬 Conversation</h3>
            <ConversationPreview dialogue={lessonData.dialogue} />
          </div>

          {lessonData.vocabulary.length > 0 && (
            <div className="space-y-6">
                <div className="border border-gray-300 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-(--primary) mb-4">📚 Vocabulary Review</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {lessonData.vocabulary.map((v, i) => (
                    <div key={i} className="bg-(--primary-light) p-3 rounded-lg shadow-sm">
                        <p className="font-semibold text-gray-800">{v.term}</p>
                        <p className="text-gray-600">{v.meaning}</p>
                    </div>
                    ))}
                </div>
                </div>

                {!showMatching && (
                <div className="flex justify-center">
                    <button
                    onClick={() => setShowMatching(true)}
                    className="px-6 py-3 bg-(--primary) text-white rounded-full font-semibold text-lg shadow hover:brightness-90 transition"
                    >
                    🎮 Start Test
                    </button>
                </div>
                )}

                {showMatching && (
                <MatchingGame pairs={lessonData.vocabulary} />
                )}
            </div>
            )}


          {lessonData.culturalNote && (
            <div>
              <h3 className="font-semibold text-2xl mb-2">🧠 Cultural Note</h3>
              <p>{lessonData.culturalNote}</p>
            </div>
          )}

          {lessonData.writtenExercise && (
            <div>
              <h3 className="font-semibold text-2xl mb-2">✍️ Written Exercise</h3>
              <p>{lessonData.writtenExercise}</p>
            </div>
          )}

          {lessonData.quiz?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-2xl mb-2">🧪 Quiz</h3>
              <QuizRenderer quiz={lessonData.quiz} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateLesson;