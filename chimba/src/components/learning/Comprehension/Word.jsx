import React, { useState } from 'react'
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
      <div className="relative inline-block">
        <div
          onClick={type === 'word' ? initiatePopup : null}
          id={id}
          className={`
            rounded-md 
            cursor-pointer 
            transition duration-200 
            hover:bg-yellow-300 
            text-gray-800 
            font-medium
            whitespace-pre-wrap
          `}
        >
          {children}
        </div>

        <div>
          <PopUp popUpOn={popUpOn} closePopUp={closePopUp}>
            {children}
          </PopUp>
        </div>
      </div>


  )
}

export default Word