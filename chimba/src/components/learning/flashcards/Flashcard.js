import { useState, useEffect } from "react";
import "./Flashcard.css";

const Flashcard = ({ term, definition, flashcardShown }) => {
  const [side, setSide] = useState(true);


  const flipSide = () => {
    setSide(prevSide => !prevSide);
  };

  // every time we switch flashcard, we want it to default show the term
  // so everytime card changes, need to reset side to term

  useEffect(() => {
    setSide(true)
  }, [flashcardShown])

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${!side ? "flip" : ""}`} onClick={flipSide}>
        <p className={side ? "term" : "definition"}>
          {side ? term : definition}
        </p>
      </div>
      <button className="flip-button" onClick={flipSide}>
        View {side ? "definition" : "term"} 
      </button>
    </div>
  );
};

export default Flashcard;
