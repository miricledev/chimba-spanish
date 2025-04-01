import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

export const ConversationPreview = ({ dialogue }) => {
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