import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import { useAuth } from "../../authorisation/AuthProvider";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { IconContext } from "react-icons";
import "./Flashcard.css";

const FlashcardApp = () => {
    const [flashcardSet, setFlashcardSet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashcardShown, setFlashcardShown] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        axios.post('/get/terms', { id: user.id })
            .then(res => {
                setFlashcardSet(Object.entries(res.data).map(([term, definition]) => (
                    <Flashcard term={term} definition={definition} flashcardShown={flashcardShown} />
                )));
                setLoading(false);
            });
    }, []);

    const decrementIndex = () => {
        setFlashcardShown(prev => (prev > 0 ? prev - 1 : prev));
    };

    const incrementIndex = () => {
        setFlashcardShown(prev => (prev < flashcardSet.length - 1 ? prev + 1 : prev));
    };

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return !loading ? (
        <div className="flashcard-app">
          <h2>Flashcards</h2>
            {flashcardSet[flashcardShown]}

            <div className="nav-buttons">
                <IconContext.Provider value={{ className: "nav-button" }}>
                    <button onClick={decrementIndex}><FaArrowCircleLeft /></button>
                    <button onClick={incrementIndex}><FaArrowCircleRight /></button>
                </IconContext.Provider>
            </div>

            <p className="flashcard-counter">{`${flashcardShown + 1}/${flashcardSet.length}`}</p>

            <IconContext.Provider value={{ className: "shuffle-button" }}>
                <button onClick={() => setFlashcardSet(prev => shuffle([...prev]))}><FaShuffle /></button>
            </IconContext.Provider>
        </div>
    ) : <p className="loading-text">Loading...</p>;
};

export default FlashcardApp;
