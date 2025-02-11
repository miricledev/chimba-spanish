import React, { useState } from 'react'
import Modal from "react-modal"

Modal.setAppElement('#root')

export const PopUp = ({children, popUpOn, closePopUp}) => {


    const speak = () => {
        const textSpoken = React.Children.toArray(children).join(" ")
        const speech = new SpeechSynthesisUtterance(textSpoken);
        speech.lang = "es-ES"; // Set language
        speech.rate = 1; // Speed (0.1 to 10)
        speech.pitch = 1; // Pitch (0 to 2)
        speechSynthesis.speak(speech);
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
                <h2>{children}</h2>

                <button onClick={speak}>Speak</button>

                <button onClick={closePopUp}>Close</button>
            </Modal>
        </div>
  )
}
