import { useState, useEffect } from "react";
import './Flashcard.css'; // ⬅️ We'll add CSS here for the flip animation

const Flashcard = ({ term, definition, flashcardShown }) => {
  const [side, setSide] = useState(true);

  const flipSide = () => {
    setSide(prevSide => !prevSide);
  };

  useEffect(() => {
    setSide(true);
  }, [flashcardShown]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-[300px] h-[200px] md:w-[400px] md:h-[250px] perspective"
        onClick={flipSide}
      >
        <div className={`relative w-full h-full duration-500 transform-style-preserve-3d ${side ? '' : 'rotate-y-180'}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-[#ff004c] text-white rounded-2xl border border-black flex items-center justify-center text-2xl font-bold shadow-md">
            <p className="drop-shadow text-center">{term}</p>
            <div className="absolute bottom-3 flex gap-4">
              <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div className="bg-red-500/70 rounded-full w-8 h-8 flex items-center justify-center text-white text-xl">
                ✕
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-[#ff004c] text-white rounded-2xl border border-black flex items-center justify-center text-2xl font-bold shadow-md rotate-y-180">
            <p className="drop-shadow text-center">{definition}</p>
          </div>
        </div>
      </div>

      <button
        onClick={flipSide}
        className="border px-4 py-1 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        View {side ? "definition" : "term"}
      </button>
    </div>
  );
};

export default Flashcard;
