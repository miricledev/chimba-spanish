import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CreateLessonQuiz = ({ onQuizChange }) => {
  const [questions, setQuestions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const handleInputChange = (id, key, value) => {
    const updated = questions.map(q => q.id === id ? { ...q, [key]: value } : q);
    setQuestions(updated);
    onQuizChange(updated);
  };

  const handleBlocksInput = (id, value) => {
    const blocks = value.split(' ').filter(w => w);
    handleInputChange(id, 'correctAnswer', value);
    handleInputChange(id, 'blocks', blocks);
  };

  // Handle array changes for matching pairs
  const handleMatchingPairChange = (questionId, pairIndex, side, value) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;
    
    const updatedQuestion = { ...questions[questionIndex] };
    if (!updatedQuestion.pairs) {
      updatedQuestion.pairs = [];
    }
    
    // Ensure the pair exists
    if (!updatedQuestion.pairs[pairIndex]) {
      updatedQuestion.pairs[pairIndex] = { left: '', right: '' };
    }
    
    // Update the specific side
    updatedQuestion.pairs[pairIndex][side] = value;
    
    // Update the questions array
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
    onQuizChange(updatedQuestions);
  };

  const addPair = (questionId) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;
    
    const updatedQuestion = { ...questions[questionIndex] };
    if (!updatedQuestion.pairs) {
      updatedQuestion.pairs = [];
    }
    
    updatedQuestion.pairs.push({ left: '', right: '' });
    
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
    onQuizChange(updatedQuestions);
  };

  const removePair = (questionId, pairIndex) => {
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;
    
    const updatedQuestion = { ...questions[questionIndex] };
    if (!updatedQuestion.pairs || updatedQuestion.pairs.length <= pairIndex) return;
    
    updatedQuestion.pairs = updatedQuestion.pairs.filter((_, i) => i !== pairIndex);
    
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
    onQuizChange(updatedQuestions);
  };

  // Handle image URL input for image-based questions
  const handleImageChange = (questionId, value) => {
    handleInputChange(questionId, 'imageURL', value);
  };

  // Handle boolean value for true/false questions
  const handleTrueFalseChange = (questionId, value) => {
    handleInputChange(questionId, 'correctAnswer', value);
  };

  const addQuestion = () => {
    if (questions.length >= 10) return;
    const newQuestion = {
      id: uuidv4(),
      type: 'word_blocks',
      question: '',
      correctAnswer: '',
      blocks: [],
      audioURL: ''
    };
    const updated = [...questions, newQuestion];
    setQuestions(updated);
    onQuizChange(updated);
    setExpandedId(newQuestion.id);
  };

  const removeQuestion = (id) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    onQuizChange(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);
    onQuizChange(items);
  };

  const renderPreview = (q) => {
    switch(q.type) {
      case 'word_blocks':
        return <p className="text-gray-700">🧩 {q.blocks?.join(' ') || '[Empty]'}</p>;
      
      case 'audio_type':
        return <p className="text-gray-700">🎧 {q.correctAnswer || '[Answer not set]'}</p>;
      
      case 'fill_blank':
        return <p className="text-gray-700">📝 {q.question}</p>;
      
      case 'matching_pairs':
        return <p className="text-gray-700">🔄 Matching: {q.pairs?.length || 0} pairs</p>;
      
      case 'true_false':
        return <p className="text-gray-700">✓/✗ {q.question} ({q.correctAnswer ? 'True' : 'False'})</p>;
      
      case 'image_question':
        return <p className="text-gray-700">🖼️ {q.question}</p>;
      
      default:
        return <p className="text-gray-700">{q.question} → {q.correctAnswer}</p>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-(--primary) mb-10 text-center">🧠 Build a Custom Quiz</h1>

      <button
        onClick={addQuestion}
        disabled={questions.length >= 10}
        className="mb-6 bg-(--primary) text-white font-semibold py-2 px-6 rounded-md hover:brightness-90"
      >
        ➕ Add Question
      </button>

      <Link to="/2/quiz-test" className="text-blue-600 underline hover:text-blue-800 ml-4">
        Go to Quiz Test
      </Link>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="quiz">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {questions.map((q, idx) => (
                <Draggable key={q.id} draggableId={q.id} index={idx}>
                  {(provided) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white border border-gray-300 rounded-lg shadow-sm mb-4"
                      layout
                    >
                      <div
                        className="flex justify-between items-center p-4 cursor-pointer"
                        onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-move">
                            <FaGripVertical size={18} />
                          </span>
                          <span className="font-bold text-lg">{idx + 1}.</span>
                          {renderPreview(q)}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(q.id);
                          }}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedId === q.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 pt-0 space-y-4 border-t"
                          >
                            <div>
                              <label className="block font-semibold mb-1">Question Type</label>
                              <select 
                                value={q.type} 
                                onChange={(e) => handleInputChange(q.id, 'type', e.target.value)} 
                                className="w-full border px-3 py-2 rounded-md"
                              >
                                <option value="word_blocks">🧩 Word Block Builder</option>
                                <option value="audio_type">🎧 Type What You Hear</option>
                                <option value="fill_blank">📝 Fill in the Blank</option>
                                <option value="translate_es">🇬🇧→🇪🇸 Translate to Spanish</option>
                                <option value="translate_en">🇪🇸→🇬🇧 Translate to English</option>
                                <option value="matching_pairs">🔄 Matching Pairs</option>
                                <option value="true_false">✓/✗ True or False</option>
                                <option value="image_question">🖼️ Image-Based Question</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-semibold mb-1">Prompt</label>
                              <input 
                                type="text" 
                                value={q.question} 
                                onChange={(e) => handleInputChange(q.id, 'question', e.target.value)} 
                                className="w-full border px-3 py-2 rounded-md" 
                              />
                            </div>

                            {q.type === 'word_blocks' && (
                              <div>
                                <label className="block font-semibold mb-1">Correct Sentence</label>
                                <input 
                                  type="text" 
                                  value={q.correctAnswer} 
                                  onChange={(e) => handleBlocksInput(q.id, e.target.value)} 
                                  className="w-full border px-3 py-2 rounded-md" 
                                />
                              </div>
                            )}

                            {q.type === 'audio_type' && (
                              <div>
                                <label className="block font-semibold mb-1">Audio URL</label>
                                <input 
                                  type="text" 
                                  value={q.audioURL} 
                                  onChange={(e) => handleInputChange(q.id, 'audioURL', e.target.value)} 
                                  className="w-full border px-3 py-2 rounded-md mb-2" 
                                />
                                <label className="block font-semibold mb-1">Correct Answer</label>
                                <input 
                                  type="text" 
                                  value={q.correctAnswer} 
                                  onChange={(e) => handleInputChange(q.id, 'correctAnswer', e.target.value)} 
                                  className="w-full border px-3 py-2 rounded-md" 
                                />
                              </div>
                            )}

                            {q.type === 'fill_blank' && (
                              <div>
                                <label className="block font-semibold mb-1">Correct Word</label>
                                <input 
                                  type="text" 
                                  value={q.correctAnswer} 
                                  onChange={(e) => handleInputChange(q.id, 'correctAnswer', e.target.value)} 
                                  className="w-full border px-3 py-2 rounded-md" 
                                />
                              </div>
                            )}

                            {(q.type === 'translate_es' || q.type === 'translate_en') && (
                              <div>
                                <label className="block font-semibold mb-1">Correct Translation</label>
                                <input 
                                  type="text" 
                                  value={q.correctAnswer} 
                                  onChange={(e) => handleInputChange(q.id, 'correctAnswer', e.target.value)} 
                                  className="w-full border px-3 py-2 rounded-md" 
                                />
                              </div>
                            )}

                            {q.type === 'matching_pairs' && (
                              <div>
                                <label className="block font-semibold mb-1">Matching Pairs</label>
                                <div className="space-y-2 mb-2">
                                  {q.pairs && q.pairs.map((pair, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                      <input
                                        type="text"
                                        value={pair.left}
                                        onChange={(e) => handleMatchingPairChange(q.id, idx, 'left', e.target.value)}
                                        className="w-1/2 border px-3 py-2 rounded-md"
                                        placeholder="Left item"
                                      />
                                      <input
                                        type="text"
                                        value={pair.right}
                                        onChange={(e) => handleMatchingPairChange(q.id, idx, 'right', e.target.value)}
                                        className="w-1/2 border px-3 py-2 rounded-md"
                                        placeholder="Right item"
                                      />
                                      <button
                                        onClick={() => removePair(q.id, idx)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  onClick={() => addPair(q.id)}
                                  className="mt-2 flex items-center gap-1 text-sm bg-(--primary) text-white px-3 py-1 rounded"
                                >
                                  <FaPlus /> Add Pair
                                </button>
                              </div>
                            )}

                            {q.type === 'true_false' && (
                              <div>
                                <label className="block font-semibold mb-1">Correct Answer</label>
                                <div className="flex gap-4">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      checked={q.correctAnswer === true}
                                      onChange={() => handleTrueFalseChange(q.id, true)}
                                      className="h-4 w-4 text-(--primary)"
                                    />
                                    <span className="ml-2">True</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input
                                      type="radio"
                                      checked={q.correctAnswer === false}
                                      onChange={() => handleTrueFalseChange(q.id, false)}
                                      className="h-4 w-4 text-(--primary)"
                                    />
                                    <span className="ml-2">False</span>
                                  </label>
                                </div>
                              </div>
                            )}

                            {q.type === 'image_question' && (
                              <div>
                                <label className="block font-semibold mb-1">Image URL</label>
                                <input
                                  type="text"
                                  value={q.imageURL || ''}
                                  onChange={(e) => handleImageChange(q.id, e.target.value)}
                                  className="w-full border px-3 py-2 rounded-md mb-2"
                                  placeholder="Enter image URL"
                                />
                                <label className="block font-semibold mb-1">Correct Answer</label>
                                <input
                                  type="text"
                                  value={q.correctAnswer || ''}
                                  onChange={(e) => handleInputChange(q.id, 'correctAnswer', e.target.value)}
                                  className="w-full border px-3 py-2 rounded-md"
                                  placeholder="Enter the correct answer"
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CreateLessonQuiz;