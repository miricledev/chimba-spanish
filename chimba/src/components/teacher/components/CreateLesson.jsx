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
  title: 'Amor propio y autopercepción 💭',
  level: 'C2',
  section: 'Identity & Emotions',
  objective: 'Reflexionar sobre la relación entre autopercepción, autoestima y amor propio, explorando matices lingüísticos y expresiones profundas del español colombiano.',
  videoURL: 'https://www.youtube.com/embed/hTWKbfoikeg',
  audioURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  dialogue: [
    { id: '1', type: 'message', speaker: 'A', text: 'Últimamente he pensado que el amor propio es una construcción más que una condición.' },
    { id: '2', type: 'message', speaker: 'B', text: '¿Y eso por qué? ¿Sentís que no te querés lo suficiente?' },
    { id: '3', type: 'message', speaker: 'A', text: 'No es falta de cariño, es que a veces me exijo tanto que olvido reconocer mis logros.' },
    { id: '4', type: 'question', text: '¿Qué quiere decir "me exijo tanto que olvido reconocer mis logros"?', 
      options: ['Que no trabaja', 'Que se critica mucho', 'Que no tiene metas', 'Que no valora a otros'], 
      correctOption: 1 },
    { id: '5', type: 'message', speaker: 'B', text: 'Eso nos pasa a muchos. La autoexigencia, cuando se desborda, puede volverse una trampa.' },
    { id: '6', type: 'message', speaker: 'A', text: 'Total. Y más en una sociedad que romantiza la productividad a costa del bienestar.' },
    { id: '7', type: 'question', text: '¿Qué significa "romantiza la productividad"?', 
      options: ['La ve con escepticismo', 'La critica constantemente', 'La idealiza y exagera su valor', 'La considera irrelevante'], 
      correctOption: 2 },
    { id: '8', type: 'message', speaker: 'B', text: 'Sí, pareciera que descansar fuera sinónimo de pereza.' },
    { id: '9', type: 'message', speaker: 'A', text: 'Por eso he empezado a cultivar la autocompasión. No como excusa, sino como herramienta de equilibrio.' },
    { id: '10', type: 'question', text: '¿Cuál es el enfoque de A hacia la autocompasión?', 
      options: ['La ve como debilidad', 'La usa para evitar responsabilidades', 'La ve como una herramienta positiva', 'No cree en ella'], 
      correctOption: 2 },
    { id: '11', type: 'message', speaker: 'B', text: 'Eso suena maduro. ¿Y cómo lo practicas en lo cotidiano?' },
    { id: '12', type: 'message', speaker: 'A', text: 'Celebrando los avances pequeños, hablándome bonito y poniendo límites sanos.' },
    { id: '13', type: 'message', speaker: 'B', text: 'Uf, poner límites. Esa es la parte más difícil para muchos.' },
    { id: '14', type: 'message', speaker: 'A', text: 'Claro. Porque nos educaron a complacer, no a priorizarnos sin culpa.' },
    { id: '15', type: 'question', text: '¿Qué implica "priorizarnos sin culpa"?', 
      options: ['Ser egoístas', 'Ignorar a los demás', 'Cuidarse sin sentirse mal por ello', 'No tener emociones'], 
      correctOption: 2 },
    { id: '16', type: 'message', speaker: 'B', text: 'Qué belleza eso. Me inspiras a repensar cómo me trato a mí mismo.' },
    { id: '17', type: 'message', speaker: 'A', text: 'Eso es lo bonito de hablar desde la vulnerabilidad, ¿cierto? Nos espejamos.' }
  ],
  vocabulary: [
    { id: '1', term: 'Autoexigencia', meaning: 'Tendencia a exigirse mucho a uno mismo' },
    { id: '2', term: 'Romantizar', meaning: 'Idealizar algo, ver solo lo positivo de manera exagerada' },
    { id: '3', term: 'Autocompasión', meaning: 'Trato amable y comprensivo hacia uno mismo en momentos de dificultad' },
    { id: '4', term: 'Ponerse límites sanos', meaning: 'Establecer barreras personales para cuidar el bienestar emocional' },
    { id: '5', term: 'Espejarnos', meaning: 'Ver en otro un reflejo de lo propio, especialmente emociones o procesos internos' }
  ],
  culturalNote: 'En Colombia, el discurso sobre el amor propio ha ganado fuerza en círculos jóvenes y académicos, especialmente en redes sociales. Sin embargo, también persiste la presión cultural por ser siempre alegre, productivo y servicial. Las nuevas generaciones están comenzando a resignificar palabras como "autocompasión" y a cuestionar la idealización del sacrificio.',
  writtenExercise: 'Escribe una reflexión corta (100-150 palabras) sobre cómo manejás tu autoexigencia. Usa al menos tres palabras del vocabulario de esta lección.',
  quiz: [
    {
      id: 'q1', type: 'translate_es',
      question: 'Translate to Spanish: "I am learning to speak to myself with compassion."',
      correctAnswer: 'Estoy aprendiendo a hablarme con compasión.'
    },
    {
      id: 'q2', type: 'true_false',
      question: 'Romantizar algo implica verlo desde una perspectiva crítica.',
      correctAnswer: false
    },
    {
      id: 'q3', type: 'fill_blank',
      question: 'Cuando alguien "se ________", se exige demasiado a sí mismo.',
      correctAnswer: 'autoexige'
    },
    {
      id: 'q4', type: 'word_blocks',
      question: 'Reorganiza la frase:',
      correctAnswer: 'La autocompasión no es debilidad.',
      blocks: ['La', 'autocompasión', 'no', 'es', 'debilidad.']
    },
    {
      id: 'q5', type: 'translate_en',
      question: 'Traduce al inglés: "Ponerse límites sanos."',
      correctAnswer: 'Setting healthy boundaries.'
    },
    {
      id: 'q6', type: 'audio_type',
      question: 'Escucha y escribe lo que oyes.',
      correctAnswer: 'Celebrando los avances pequeños.',
      audioURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
      id: 'q7', type: 'true_false',
      question: 'La autocompasión implica evadir los problemas.',
      correctAnswer: false
    },
    {
      id: 'q8', type: 'matching_pairs',
      question: 'Relaciona las expresiones con su significado:',
      pairs: [
        { left: 'Autoexigencia', right: 'Presión personal constante' },
        { left: 'Romantizar', right: 'Idealizar de forma irreal' },
        { left: 'Ponerse límites sanos', right: 'Cuidarse emocionalmente' },
        { left: 'Espejarnos', right: 'Reflejarse en otro' }
      ]
    },
    {
      id: 'q9', type: 'image_question',
      question: '¿Qué representa esta imagen?',
      correctAnswer: 'Amor propio',
      imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Self_love_handwritten.jpg/800px-Self_love_handwritten.jpg'
    },
    {
      id: 'q10', type: 'translate_es',
      question: 'Translate to Spanish: "Sometimes I forget to celebrate my small wins."',
      correctAnswer: 'A veces olvido celebrar mis pequeños logros.'
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

  const { user } = useAuth()

  const submitLessonToBackend = async () => {
    try {
      const response = await axios.post('/api/set/lesson', {
        lesson: lessonData,
        teacherId: 1,   // replace with actual teacherId from auth context or props
        courseId: 1     // replace with actual courseId from course selector
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