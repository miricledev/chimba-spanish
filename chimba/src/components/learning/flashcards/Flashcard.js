import { useState, useEffect } from "react";
import "./Flashcard.css";

const Flashcard = ({ term, definition, flashcardShown }) => {
    const [side, setSide] = useState(true);

    const flipSide = () => {
        setSide(prevSide => !prevSide);
    };

    useEffect(() => {
        setSide(true);
    }, [flashcardShown]);

    return (
      <div className="flashcard-container">
         
  
          {/* Flashcard */}
          <div className={`flashcard ${!side ? "flip" : ""}`} onClick={flipSide}>
              <p className="term">{term}</p>
              <p className="definition">{definition}</p>
          </div>
  
          <button className="flip-button" onClick={flipSide}>
              View {side ? "definition" : "term"} 
          </button>
      </div>
  );
  
};

export default Flashcard;
