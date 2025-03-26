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
            axios.post("/api/translate", {
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
        axios.post('/api/set/terms', {
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
      content: {
        width: "90%",
        maxWidth: "500px",
        margin: "auto",
        padding: "0",
        borderRadius: "0.75rem",
        border: "none",
        inset: "50% auto auto 50%",
        transform: "translate(-50%, -50%)",
      },
    }}
  >
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-(--primary)">{children}</h2>
        <button onClick={closePopUp} className="text-gray-400 hover:text-red-500 transition">
          <IoCloseSharp size={24} />
        </button>
      </div>

      {translatedWord && (
        <p className="mb-4 text-gray-700 text-base italic">{translatedWord}</p>
      )}

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={speak}
          className="p-2 rounded-full hover:bg-gray-100 transition text-(--primary)"
          title="Pronounce"
        >
          <PiUserSoundBold size={20} />
        </button>

        <button
          onClick={addToFlashcards}
          className="px-4 py-2 rounded-lg bg-(--primary) text-white hover:opacity-90 transition font-medium"
        >
          Add to flashcards
        </button>
      </div>

      {insertSuccess && (
        <p className="text-sm text-green-600">{insertSuccess}</p>
      )}
    </div>
  </Modal>
</div>

    );
};
