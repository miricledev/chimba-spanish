import React, { useState } from 'react'
import './comprehension.css'
import { PopUp } from './PopUp'


const Word = ({children, type, id}) => {
    const [popUpOn, setPopUpOn] = useState(false)

    const initiatePopup = () => {
      setPopUpOn(true)
    }

    const closePopUp = () => {
      setPopUpOn(false)
    }

    return (
        <div>
            <div 
                onClick={type=='word' ? initiatePopup : null} 
                id={id} 
                className={type}
            >
                {children}
            </div>
            <div>
                <PopUp popUpOn={popUpOn} closePopUp={closePopUp}>{children}</PopUp>
            </div>
        </div>

  )
}

export default Word