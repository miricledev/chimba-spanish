import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// MatchingGame component
const MatchingGame = ({ pairs, onComplete }) => {
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledMeanings, setShuffledMeanings] = useState([]);
  const [selected, setSelected] = useState({ term: null, meaning: null });
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    setShuffledTerms(shuffleArray(pairs.map((p) => ({ ...p, type: 'term' }))));
    setShuffledMeanings(shuffleArray(pairs.map((p) => ({ ...p, type: 'meaning' }))));
  }, [pairs]);

  useEffect(() => {
    // Check if all pairs are matched and call onComplete callback if provided
    if (matchedPairs.length === pairs.length && onComplete) {
      onComplete(true);
    }
  }, [matchedPairs, pairs, onComplete]);

  const handleClick = (item) => {
    if (matchedPairs.find((pair) => pair.term === item.term)) return;

    const isTerm = item.type === 'term';
    const other = isTerm ? selected.meaning : selected.term;

    if (!other) {
      setSelected({ ...selected, [item.type]: item });
    } else {
      if (item.term === other.term) {
        setMatchedPairs([...matchedPairs, { term: item.term, meaning: item.meaning }]);
      }
      setSelected({ term: null, meaning: null });
    }
  };

  const renderCard = (item, index, side) => {
    const isMatched = matchedPairs.find((pair) => pair.term === item.term);
    const isSelected = selected[side]?.term === item.term;
    return (
      <motion.div
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleClick({ ...item, type: side })}
        className={`p-1 rounded-xl w-full text-center cursor-pointer shadow-lg transition-colors duration-300 h-12 flex items-center justify-center text-lg font-medium
          ${isMatched ? 'bg-green-300 text-green-800' : isSelected ? 'bg-blue-300 text-blue-800' : 'bg-white text-gray-800'}`}
      >
        {side === 'term' ? item.term : item.meaning}
      </motion.div>
    );
  };

  return (
    <div className="w-full mx-auto my-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          {shuffledTerms.map((item, i) => renderCard(item, i, 'term'))}
        </div>
        <div className="space-y-3">
          {shuffledMeanings.map((item, i) => renderCard(item, i, 'meaning'))}
        </div>
      </div>

      {matchedPairs.length === pairs.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 p-4 text-center bg-green-100 text-green-800 font-semibold text-xl rounded-xl shadow-md"
        >
          🎉 Great job! You've matched everything correctly.
        </motion.div>
      )}
    </div>
  );
};

const QuizRenderer = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  // For matching pairs
  const [shuffledPairs, setShuffledPairs] = useState({ left: [], right: [] });
  const [matchedPairs, setMatchedPairs] = useState({});

  // Guard against empty quiz prop
  if (!quiz || !Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">No quiz questions available</h2>
        <p className="mt-4 text-gray-600">Please add some questions to the quiz.</p>
      </div>
    );
  }

  const currentQuestion = quiz[currentIndex] || {};

  useEffect(() => {
    setUserInput('');
    setShowAnswer(false);
    setIsCorrect(null);
    
    if (!currentQuestion) return;

    if (currentQuestion.type === 'word_blocks' && Array.isArray(currentQuestion.blocks)) {
      const shuffled = [...currentQuestion.blocks].sort(() => Math.random() - 0.5);
      setShuffledBlocks(shuffled.map(word => ({ word, selected: false })));
      setSelectedBlocks([]);
    } else if (currentQuestion.type === 'matching_pairs' && Array.isArray(currentQuestion.pairs)) {
      // Prepare and shuffle the pairs for matching
      const rightItems = [...currentQuestion.pairs].map(pair => pair.right).sort(() => Math.random() - 0.5);
      setShuffledPairs({
        left: [...currentQuestion.pairs].map(pair => pair.left),
        right: rightItems
      });
      setMatchedPairs({});
    }
  }, [currentIndex, currentQuestion]);

  const handleBlockToggle = (wordObj) => {
    if (wordObj.selected) {
      setSelectedBlocks(selectedBlocks.filter(w => w !== wordObj.word));
      setShuffledBlocks(shuffledBlocks.map(w => w.word === wordObj.word ? { ...w, selected: false } : w));
    } else {
      setSelectedBlocks([...selectedBlocks, wordObj.word]);
      setShuffledBlocks(shuffledBlocks.map(w => w.word === wordObj.word ? { ...w, selected: true } : w));
    }
  };

  const resetBlocks = () => {
    setSelectedBlocks([]);
    setShuffledBlocks(shuffledBlocks.map(w => ({ ...w, selected: false })));
  };

  const handlePairMatch = (leftIndex, rightItem) => {
    // Toggle the selection
    if (matchedPairs[leftIndex] === rightItem) {
      const newMatchedPairs = { ...matchedPairs };
      delete newMatchedPairs[leftIndex];
      setMatchedPairs(newMatchedPairs);
    } else {
      setMatchedPairs({ ...matchedPairs, [leftIndex]: rightItem });
    }
  };

  const checkAnswer = () => {
    let correct = false;

    switch (currentQuestion.type) {
      case 'word_blocks':
        correct = selectedBlocks.join(' ') === (currentQuestion.correctAnswer || '');
        break;
      
      case 'true_false':
        // Convert string 'true'/'false' to actual boolean for comparison
        const userBoolAnswer = userInput === 'true';
        correct = userBoolAnswer === Boolean(currentQuestion.correctAnswer);
        break;
      
      case 'matching_pairs':
        if (Array.isArray(currentQuestion.pairs) && Object.keys(matchedPairs).length === currentQuestion.pairs.length) {
          correct = currentQuestion.pairs.every((pair, index) => 
            matchedPairs[index] === pair.right
          );
        }
        break;
      
      case 'audio_type':
      case 'fill_blank':
      case 'translate_es':
      case 'translate_en':
      case 'image_question':
      default:
        // For text input questions, strip whitespace and do case-insensitive comparison
        // Ensure we're working with strings
        const userAnswer = String(userInput || '').trim().toLowerCase();
        const correctAnswer = String(currentQuestion.correctAnswer || '').trim().toLowerCase();
        correct = userAnswer === correctAnswer;
        break;
    }

    setIsCorrect(correct);
    setShowAnswer(true);
    if (correct) setScore(score + 1);
  };

  const nextQuestion = () => {
    setUserInput('');
    setShowAnswer(false);
    setIsCorrect(null);
    setSelectedBlocks([]);
    setMatchedPairs({});
    
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <motion.div
        className="p-10 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-extrabold mb-6 text-green-600">🎉 Quiz Complete!</h1>
        <p className="text-2xl mb-4">Your Score: <span className="font-bold">{score} / {quiz.length}</span></p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 bg-(--primary) text-white px-6 py-2 rounded-xl hover:brightness-90"
        >
          🔄 Retry Quiz
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={currentIndex}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🧠 Question {currentIndex + 1} of {quiz.length}</h2>
        <p className="text-lg text-gray-500">Score: {score}</p>
      </div>

      <motion.div
        className="mb-6 text-xl text-center text-gray-700 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Display question type icons */}
        <div className="mb-2">
          {currentQuestion.type === 'word_blocks' && '🧩 '}
          {currentQuestion.type === 'audio_type' && '🎧 '}
          {currentQuestion.type === 'fill_blank' && '📝 '}
          {currentQuestion.type === 'translate_es' && '🇬🇧→🇪🇸 '}
          {currentQuestion.type === 'translate_en' && '🇪🇸→🇬🇧 '}
          {currentQuestion.type === 'matching_pairs' && '🔄 '}
          {currentQuestion.type === 'true_false' && '✓/✗ '}
          {currentQuestion.type === 'image_question' && '🖼️ '}
        </div>
        
        {/* Display question */}
        <p>{currentQuestion.question || ''}</p>
        
        {/* Show image if it's an image question */}
        {currentQuestion.type === 'image_question' && currentQuestion.imageURL && (
          <div className="mt-4">
            <img 
              src={currentQuestion.imageURL} 
              alt="Question" 
              className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
            />
          </div>
        )}
      </motion.div>

      {/* Word Blocks Question Type */}
      {currentQuestion.type === 'word_blocks' && !showAnswer && (
        <>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {shuffledBlocks.map((wordObj, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleBlockToggle(wordObj)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-full border font-medium shadow-sm transition-all duration-200 ${
                  wordObj.selected ? 'bg-green-200 border-green-400 text-green-900' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {wordObj.word}
              </motion.button>
            ))}
          </div>

          <div className="border border-dashed border-gray-400 p-4 min-h-[60px] rounded-xl bg-gray-50 text-center text-lg font-semibold">
            {selectedBlocks.join(' ')}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={checkAnswer}
              className="bg-(--primary) text-white py-2 px-6 rounded-md hover:brightness-90"
            >
              Submit
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={resetBlocks}
              className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
            >
              Reset
            </motion.button>
          </div>
        </>
      )}

      {/* Audio Question Type */}
      {currentQuestion.type === 'audio_type' && (
        <div className="mb-6">
          {currentQuestion.audioURL ? (
            <audio controls src={currentQuestion.audioURL} className="mb-3 w-full" />
          ) : (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-3">
              No audio file available
            </div>
          )}
          {!showAnswer && (
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type what you heard"
            />
          )}
        </div>
      )}

      {/* Text Input Question Types */}
      {['translate_es', 'translate_en', 'fill_blank', 'image_question'].includes(currentQuestion.type) && !showAnswer && (
        <input
          type="text"
          className="w-full border px-3 py-2 rounded-md mb-4"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Your answer"
        />
      )}

      {/* True/False Question Type */}
      {currentQuestion.type === 'true_false' && !showAnswer && (
        <div className="flex gap-4 justify-center mt-4">
          <button
            className={`px-4 py-2 rounded-lg border font-semibold ${userInput === 'true' ? 'bg-blue-200 text-blue-800 border-blue-300' : 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'}`}
            onClick={() => setUserInput('true')}
          >
            True
          </button>
          <button
            className={`px-4 py-2 rounded-lg border font-semibold ${userInput === 'false' ? 'bg-red-200 text-red-800 border-red-300' : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'}`}
            onClick={() => setUserInput('false')}
          >
            False
          </button>
        </div>
      )}

      {/* Matching Pairs Question Type */}
      {currentQuestion.type === 'matching_pairs' && !showAnswer && Array.isArray(currentQuestion.pairs) && currentQuestion.pairs.length > 0 && (
        <MatchingGame 
          pairs={currentQuestion.pairs.map(pair => ({ 
            term: pair.left, 
            meaning: pair.right 
          }))}
          onComplete={(success) => {
            setIsCorrect(success);
            setShowAnswer(true);
            if (success) setScore(score + 1);
          }}
        />
      )}

      {/* Submit Button for all question types except word_blocks and matching_pairs (which have their own buttons) */}
      {currentQuestion.type !== 'word_blocks' && currentQuestion.type !== 'matching_pairs' && !showAnswer && (
        <div className="flex justify-center mt-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={checkAnswer}
            className="bg-(--primary) text-white py-2 px-6 rounded-md hover:brightness-90"
          >
            Submit
          </motion.button>
        </div>
      )}

      {/* Answer feedback */}
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <p className={`text-xl font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </p>
          
          {!isCorrect && (
            <div className="mt-2 text-gray-700">
              {currentQuestion.type === 'matching_pairs' && Array.isArray(currentQuestion.pairs) ? (
                <div className="space-y-2">
                  <p>Correct matches:</p>
                  {currentQuestion.pairs.map((pair, idx) => (
                    <p key={idx}><strong>{pair.left}</strong> ➔ <strong>{pair.right}</strong></p>
                  ))}
                </div>
              ) : currentQuestion.type === 'true_false' ? (
                <p>Correct Answer: <strong>{currentQuestion.correctAnswer ? 'True' : 'False'}</strong></p>
              ) : (
                <p>Correct Answer: <strong>{currentQuestion.correctAnswer || ''}</strong></p>
              )}
            </div>
          )}
          
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={nextQuestion}
            className="mt-6 bg-gray-800 text-white py-2 px-6 rounded-md hover:bg-gray-700"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizRenderer;