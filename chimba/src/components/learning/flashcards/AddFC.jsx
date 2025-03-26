import React from 'react'
import { useState } from 'react'
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import axios from 'axios';
import { useAuth } from '../../authorisation/AuthProvider';



const AddFC = () => {

  const { user } = useAuth()

  const [flashcards, setFlashcards] = useState([
    { term: "", definition: "" }
  ]);

  const [insertSuccess, setInsertSuccess] = useState('')

  const handleInputChange = (index, field, value) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);
  };

  const handleAdd = () => {
    setFlashcards([...flashcards, { term: "", definition: "" }]);
  };
  
  const handleRemove = (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  };
  
  const handleSubmit = () => {
    
    axios.post('/api/set/terms-array', {
      id: user.id,
      flashcards: flashcards.filter(card => card.term.trim() !== "" && card.definition.trim() !== "")
    }).then(res => {
        setInsertSuccess(res.data.reply);
    }).catch(error => console.log(error));
  };

  
  
  

  return (
    <div className='p-5 flex items-center justify-center w-250 h-full mt-30 flex-col gap-10'>
      {flashcards.map((card, index) => (
        <div className='flex flex-row w-200 items-center p-5 border-1 rounded-2xl' key={index}>
          <input
            type="text"
            placeholder="Term"
            value={card.term}
            onChange={(e) => handleInputChange(index, "term", e.target.value)}
            className='p-2 placeholder: text-3xl placeholder:font-carlito placeholder:font-bold'
          />
          <input
            type="text"
            placeholder="Definition"
            value={card.definition}
            onChange={(e) => handleInputChange(index, "definition", e.target.value)}
            className='p-2 placeholder: text-3xl placeholder:font-carlito placeholder:font-bold'
          />
          {index !== 0 && (
            <button
              onClick={() => handleRemove(index)}
              className='text-2xl cursor-pointer btn-hover'
            >
              <FaTrashAlt />
            </button>
            )
          }
        </div>
          )
        )
      }

      <button onClick={handleAdd} className='flex justify-center items-center cursor-pointer'>
        <IoMdAddCircle className='btn-hover text-7xl text-(--primary)' />
      </button>

      {flashcards && 
        (
          <button onClick={handleSubmit} className='btn btn-hover font-carlito text-3xl p-3 rounded-xl text-stroke-3'>
            Save changes
          </button>
        )
      }

      {insertSuccess && insertSuccess}

    </div>
  )
}

export default AddFC