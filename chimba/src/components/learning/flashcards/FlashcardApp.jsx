import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import { useAuth } from "../../authorisation/AuthProvider";
import { FaArrowCircleRight, FaArrowCircleLeft, FaTrash } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { IconContext } from "react-icons";

const FlashcardApp = () => {
    const [flashcardSet, setFlashcardSet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flashcardShown, setFlashcardShown] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        axios.post('/api/get/terms', { id: user.id })
            .then(res => {
                setFlashcardSet(Object.entries(res.data).map(([term, definition]) => (
                    <Flashcard
                        key={term}
                        term={term}
                        definition={definition}
                        flashcardShown={flashcardShown}
                    />
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
        setFlashcardShown(0)
        return array;
    };

    return !loading ? (
        <div className="flex flex-col items-center w-250 justify-center gap-6 min-h-screen px-4">
            <h2 className="text-4xl font-bold text-center">Review Flashcards</h2>

            {flashcardSet[flashcardShown]}

            <div className="flex items-center gap-15 mt-4">
                <button onClick={decrementIndex}>
                    <FaArrowCircleLeft size={36} />
                </button>

                <span className="text-2xl font-semibold">{`${flashcardShown + 1}/${flashcardSet.length}`}</span>

                <button className=" hover:scale-110 transition" onClick={() => setFlashcardSet(prev => shuffle([...prev]))}>
                    <FaShuffle size={28} />
                </button>

                <button>
                    <FaTrash size={24} />
                </button>

                <button onClick={incrementIndex}>
                    <FaArrowCircleRight size={36} />
                </button>
            </div>

            
        </div>
    ) : (
        <p className="text-center text-2xl mt-10">Loading...</p>
    );
};

export default FlashcardApp;
