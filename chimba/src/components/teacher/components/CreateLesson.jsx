import React, { useState } from 'react';
import CreateLessonQuiz from './CreateLessonQuiz';
import { v4 as uuidv4 } from 'uuid';
import { FaTrashAlt, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import QuizRenderer from './QuizRenderer';
import MatchingGame from './utilities/MatchingGame';
import axios from 'axios';
import { useAuth } from '../../authorisation/AuthProvider'


const dummyLessonData = {
  title: 'Enamorarse al estilo colombiano 💘',
  level: 'B2',
  section: 'Love & Relationships',
  objective: 'Explorar expresiones, vocabulario y matices culturales del amor en Colombia, especialmente entre los jóvenes.',
  videoURL: 'https://www.youtube.com/embed/3GwjfUFyY6M',
  audioURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  dialogue: [
    { id: '1', type: 'message', speaker: 'A', text: 'Parce, anoche conocí a alguien que me dejó sin palabras.' },
    { id: '2', type: 'message', speaker: 'B', text: '¿Otra vez? ¿Y esta qué tiene de especial?' },
    { id: '3', type: 'message', speaker: 'A', text: 'No sé… su forma de hablar, su risa, todo. Me flechó.' },
    { id: '4', type: 'question', text: '¿Qué significa "me flechó"?', options: ['Me disparó', 'Me ignoró', 'Me enamoró', 'Me insultó'], correctOption: 2 },
    { id: '5', type: 'message', speaker: 'B', text: '¿Y ya hablaron? ¿Qué le dijiste?' },
    { id: '6', type: 'message', speaker: 'A', text: 'Le dije que tenía la sonrisa más bonita que había visto.' },
    { id: '7', type: 'message', speaker: 'B', text: 'Uy, qué cursi. ¿Y funcionó?' },
    { id: '8', type: 'message', speaker: 'A', text: '¡Pues me sonrió y me pidió el Instagram! ¿Eso cuenta?' },
    { id: '9', type: 'question', text: '¿Qué indica que la otra persona estaba interesada?', options: ['Le pidió su número', 'Lo ignoró', 'Pidió su Instagram', 'Le dijo adiós'], correctOption: 2 },
    { id: '10', type: 'message', speaker: 'B', text: 'Obvio que sí. ¿Y qué han hablado desde entonces?' },
    { id: '11', type: 'message', speaker: 'A', text: 'De todo un poco… pero sobre todo de la vida, los sueños, el amor.' },
    { id: '12', type: 'message', speaker: 'B', text: 'Parce, vas en serio. ¿Ya estás tragado?' },
    { id: '13', type: 'question', text: '¿Qué significa "estar tragado"?', options: ['Estar enfermo', 'Estar enamorado', 'Estar confundido', 'Estar ocupado'], correctOption: 1 },
    { id: '14', type: 'message', speaker: 'A', text: 'No sé si decir tragado… pero sí me tiene pensando todo el día.' },
    { id: '15', type: 'message', speaker: 'B', text: 'Pues a ver si esta vez no te rompen el corazón.' },
    { id: '16', type: 'message', speaker: 'A', text: 'Tranquilo, esta vez voy con calma. Sin idealizar.' },
    { id: '17', type: 'question', text: '¿Qué significa "idealizar" en una relación?', options: ['Criticar a la persona', 'Verla de forma perfecta', 'Mentirle', 'No hablarle'], correctOption: 1 },
    { id: '18', type: 'message', speaker: 'B', text: 'Eso. Amor con los pies en la tierra. Me gusta ese enfoque.' },
    { id: '19', type: 'message', speaker: 'A', text: 'Y vos, ¿hace cuánto no te enamorás?' },
    { id: '20', type: 'message', speaker: 'B', text: 'Hace rato, parce. Pero no pierdo la fe. Uno nunca sabe.' },
    { id: '21', type: 'message', speaker: 'A', text: '¿Y si te enamoras de una amiga?' },
    { id: '22', type: 'message', speaker: 'B', text: 'Uy… eso sí es otro cuento. Se puede complicar todo.' },
    { id: '23', type: 'question', text: '¿Por qué se considera complicado enamorarse de una amiga?', options: ['Porque vive lejos', 'Porque no es atractiva', 'Porque se puede arruinar la amistad', 'Porque ya tiene novio'], correctOption: 2 },
    { id: '24', type: 'message', speaker: 'A', text: 'Pero bueno… así es el amor. A veces llega de la forma menos esperada.' },
    { id: '25', type: 'message', speaker: 'B', text: 'Y cuando llega, que sea con todo el flow paisa, ¿no?' },
  ],
  vocabulary: [
    { id: '1', term: 'Flechó', meaning: 'Enamoró de golpe, como por flechazo' },
    { id: '2', term: 'Cursi', meaning: 'Demasiado romántico o sentimental' },
    { id: '3', term: 'Tragado', meaning: 'Muy enamorado (coloquial)' },
    { id: '4', term: 'Idealizar', meaning: 'Ver a alguien de forma perfecta, sin defectos' },
    { id: '5', term: 'Con calma', meaning: 'Con paciencia, sin apresurarse' },
    { id: '6', term: 'Romper el corazón', meaning: 'Causar mucho dolor emocional' },
    { id: '7', term: 'Con los pies en la tierra', meaning: 'Ser realista' },
    { id: '8', term: 'Flow paisa', meaning: 'Estilo o encanto característico de los paisas' },
    { id: '9', term: 'Parce', meaning: 'Amigo o amiga (coloquial paisa)' },
    { id: '10', term: 'Otro cuento', meaning: 'Una situación totalmente diferente o complicada' }
  ],
  culturalNote: 'En Colombia, especialmente en la región paisa, hablar del amor involucra muchas expresiones coloquiales. Estar "tragado" o ser "cursi" son palabras comunes entre los jóvenes. A menudo, las relaciones empiezan por redes sociales como Instagram. Además, los paisas suelen usar frases como "me flechó" o "me rompió el corazón" con gran emotividad. Hablar del amor con sinceridad, sin tapujos, es parte del estilo colombiano.',
  writtenExercise: 'Escribe un diálogo entre dos amigos hablando de una persona que les gusta. Usa al menos cinco expresiones del vocabulario aprendido.',
  quiz: [
    {
      id: 'q1', type: 'translate_es',
      question: 'Translate to Spanish: "He broke my heart."',
      correctAnswer: 'Me rompió el corazón.'
    },
    {
      id: 'q2', type: 'true_false',
      question: 'La expresión "estar tragado" significa estar confundido.',
      correctAnswer: false
    },
    {
      id: 'q3', type: 'fill_blank',
      question: 'Cuando alguien te "______", significa que te enamoró repentinamente.',
      correctAnswer: 'flechó'
    },
    {
      id: 'q4', type: 'word_blocks',
      question: 'Reorganiza para formar la frase: ',
      correctAnswer: 'Estoy tragado de ella.',
      blocks: ['Estoy', 'tragado', 'de', 'ella.']
    },
    {
      id: 'q5', type: 'translate_en',
      question: 'Traduce al inglés: "Con los pies en la tierra."',
      correctAnswer: 'With your feet on the ground.'
    },
    {
      id: 'q6', type: 'audio_type',
      question: 'Escucha y escribe lo que oyes.',
      correctAnswer: 'Me pidió el Instagram.',
      audioURL: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
      id: 'q7', type: 'true_false',
      question: 'Los paisas usan mucho la palabra "parce".',
      correctAnswer: true
    },
    {
      id: 'q8', type: 'matching_pairs',
      question: 'Relaciona las expresiones con su significado:',
      pairs: [
        { left: 'Cursi', right: 'Demasiado romántico' },
        { left: 'Otro cuento', right: 'Complicado' },
        { left: 'Tragado', right: 'Muy enamorado' },
        { left: 'Flechó', right: 'Enamoró' }
      ]
    },
    {
      id: 'q9', type: 'image_question',
      question: '¿Qué representa esta imagen?',
      correctAnswer: 'Amor a primera vista',
      imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Love_at_first_sight.jpg/800px-Love_at_first_sight.jpg'
    },
    {
      id: 'q10', type: 'translate_es',
      question: 'Translate to Spanish: "Love arrives when you least expect it."',
      correctAnswer: 'El amor llega cuando menos lo esperas.'
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

// Interactive conversation preview with step-by-step reveal
const ConversationPreview = ({ dialogue }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentItem = dialogue[currentIndex];
  const isLastItem = currentIndex === dialogue.length - 1;
  
  const handleNext = () => {
    if (currentIndex < dialogue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };
  
  const checkAnswer = () => {
    if (selectedOption !== null) {
      setShowFeedback(true);
    }
  };
  
  if (!dialogue.length) return <p>No conversation added yet.</p>;
  
  return (
    <div className="p-6 border-2 rounded-3xl bg-white">
      <div className="space-y-4 mb-4">
        {dialogue.slice(0, currentIndex + 1).map((item, idx) => (
          <div key={idx} className="transition-all duration-300 ease-in-out">
            {item.type === 'message' ? (
              <div className={`max-w-[70%] w-fit px-4 py-2 rounded-xl text-white ${
                item.speaker === 'A' ? 'bg-(--primary) self-start' : 'bg-gray-400 self-end ml-auto'
              }`}>
                <strong>{item.speaker}:</strong> {item.text}
              </div>
            ) : (
              idx === currentIndex && (
                <div className="w-full p-5 bg-yellow-50 rounded-xl border border-yellow-200 shadow-md">
                  <p className="font-bold text-gray-800 text-lg mb-3">❓ {item.text}</p>
                  
                  <div className="space-y-2 mb-4">
                    {item.options.map((option, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedOption(optIdx)}
                        disabled={showFeedback}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedOption === optIdx
                            ? 'border-(--primary) bg-(--primary-light)'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${
                          showFeedback && optIdx === item.correctOption
                            ? 'bg-green-100 border-green-500'
                            : showFeedback && optIdx === selectedOption && optIdx !== item.correctOption
                            ? 'bg-red-100 border-red-500'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 mr-2">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {option}
                          {showFeedback && optIdx === item.correctOption && (
                            <FaCheck className="ml-auto text-green-600" />
                          )}
                          {showFeedback && optIdx === selectedOption && optIdx !== item.correctOption && (
                            <FaTimes className="ml-auto text-red-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {!showFeedback ? (
                    <button
                      onClick={checkAnswer}
                      disabled={selectedOption === null}
                      className={`w-full py-2 rounded-md text-white font-medium transition-all ${
                        selectedOption === null
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-(--primary) hover:brightness-90'
                      }`}
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className={`p-3 rounded-md ${
                      selectedOption === item.correctOption
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <p className="font-medium">
                        {selectedOption === item.correctOption
                          ? '✅ Correct! Great job!'
                          : `❌ Not quite. The correct answer is: ${item.options[item.correctOption]}`}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
      
      {!isLastItem && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNext}
            disabled={currentItem.type === 'question' && !showFeedback}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
              currentItem.type === 'question' && !showFeedback
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-(--primary) text-white hover:brightness-90 shadow-md hover:shadow-lg'
            }`}
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
      
      {isLastItem && currentItem.type === 'question' && !showFeedback && (
        <div className="flex justify-center mt-6">
          <button
            onClick={checkAnswer}
            disabled={selectedOption === null}
            className={`w-48 py-2 rounded-md text-white font-medium transition-all ${
              selectedOption === null
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-(--primary) hover:brightness-90'
            }`}
          >
            Check Answer
          </button>
        </div>
      )}
      
      {isLastItem && (showFeedback || currentItem.type === 'message') && (
        <div className="flex justify-center mt-6">
          <div className="px-6 py-3 bg-gray-100 rounded-full text-gray-700">
            End of conversation 🎉
          </div>
        </div>
      )}
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