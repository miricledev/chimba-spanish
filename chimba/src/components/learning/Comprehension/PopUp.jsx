import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from "react-modal";
import { useAuth } from '../../authorisation/AuthProvider';
import { PiUserSoundBold } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

Modal.setAppElement('#root');

export const PopUp = ({ children, popUpOn, closePopUp }) => {

    const { user } = useAuth();

    const childrenText = React.Children.toArray(children).join(" ");

    const [insertSuccess, setInsertSuccess] = useState('');
    const [translatedWord, setTranslatedWord] = useState('');

    const speak = () => {
        const speech = new SpeechSynthesisUtterance(childrenText);
        speech.lang = "es-ES";
        speech.rate = 1;
        speech.pitch = 1;
        speechSynthesis.speak(speech);
    };

    useEffect(() => {
        if (popUpOn) {
            axios.post("/translate", {
                text: childrenText,
                targetLang: 'EN',
            })
                .then(response => {
                    setTranslatedWord(response.data.translated_text);
                })
                .catch(error => console.log(error));
        }
    }, [popUpOn]);

    const addToFlashcards = () => {
        axios.post('/set/terms', {
            id: user.id,
            term: childrenText,
            definition: translatedWord
        }).then(res => {
            setInsertSuccess(res.data.reply);
        }).catch(error => console.log(error));
    };

    return (
        <div>
            <Modal
                isOpen={popUpOn}
                onRequestClose={closePopUp}
                contentLabel={children}
                style={{
                  overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                  content: { width: "50%", margin: "auto", padding: "20px", borderRadius: "10px" }
              }}
            >
                <button onClick={closePopUp} className="popup-close-button">
                    <IoCloseSharp />
                </button>

                <h2 className="popup-title">{children}</h2>

                {translatedWord && (<p className="popup-translation">{translatedWord}</p>)}

                <div className="popup-buttons">
                    <button onClick={speak} className="popup-icon-button">
                        <PiUserSoundBold />
                    </button>
                    <button onClick={addToFlashcards} className="popup-button">
                        Add to flashcards
                    </button>
                </div>

                {insertSuccess && (<p className="popup-translation">{insertSuccess}</p>)}
            </Modal>
        </div>
    );
};
