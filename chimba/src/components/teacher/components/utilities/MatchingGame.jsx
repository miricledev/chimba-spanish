import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const MatchingGame = ({ pairs }) => {
  const [shuffledTerms, setShuffledTerms] = useState([]);
  const [shuffledMeanings, setShuffledMeanings] = useState([]);
  const [selected, setSelected] = useState({ term: null, meaning: null });
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    setShuffledTerms(shuffleArray(pairs.map((p) => ({ ...p, type: 'term' }))));
    setShuffledMeanings(shuffleArray(pairs.map((p) => ({ ...p, type: 'meaning' }))));
  }, [pairs]);

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
        className={`p-1 rounded-xl w-100 text-center cursor-pointer shadow-lg transition-colors duration-300 h-12 flex items-center justify-center text-lg font-medium
          ${isMatched ? 'bg-green-300 text-white' : isSelected ? 'bg-blue-300 text-white' : 'bg-white text-gray-800'}`}
      >
        {side === 'term' ? item.term : item.meaning}
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-center text-(--primary) mb-6">🎮 Match the Vocabulary!</h2>
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
          className="mt-10 p-4 text-center bg-green-100 text-green-800 font-semibold text-xl rounded-xl shadow-md"
        >
          🎉 ¡Felicidades! Has emparejado todo correctamente.
        </motion.div>
      )}
    </div>
  );
};

export default MatchingGame;