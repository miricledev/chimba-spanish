import axios from 'axios';
import React, { useState } from 'react'
import Modal from "react-modal"
import { useAuth } from '../../authorisation/AuthProvider';

Modal.setAppElement('#root')

export const PopUp = ({children, popUpOn, closePopUp}) => {

    const { user } = useAuth()

    const childrenText = React.Children.toArray(children).join(" ")

    const [insertSuccess, setInsertSuccess] = useState('')


    const speak = () => {
        const speech = new SpeechSynthesisUtterance(childrenText);
        speech.lang = "es-ES"; // Set language
        speech.rate = 1; // Speed (0.1 to 10)
        speech.pitch = 1; // Pitch (0 to 2)
        speechSynthesis.speak(speech);
    };

    const addToFlashcards = () => {
      axios.post('/set/terms', {
        id: user.id,
        term: childrenText,
        definition: `Translated: ${childrenText}`
      }).then(
        res => {
            console.log(res.data.reply)
            setInsertSuccess(res.data.reply)
        }
      ).catch(
        error => console.log(error)
      )
    }


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
                <h2>{children}</h2>

                <button onClick={speak}>Speak</button>
                <button onClick={addToFlashcards}>Add to flashcards</button>

                {insertSuccess && (<p>{insertSuccess}</p>)}

                <button onClick={closePopUp}>Close</button>
            </Modal>
        </div>
  )
}
