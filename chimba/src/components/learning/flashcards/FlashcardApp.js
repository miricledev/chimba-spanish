import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Flashcard from './Flashcard'

const FlashcardApp = () => {

    // array of the flashcards
    const [flashcardSet, setFlashcardSet] = useState([])

    const [loading, setLoading] = useState(true)
    // count to allow us to navigate through each flashcard
    const [flashcardShown, setFlashcardShown] = useState(0)

    // contains boundaries
    const decrementIndex = () => {
      setFlashcardShown(prevFlashcardShown => {
        return prevFlashcardShown > 0 ? prevFlashcardShown -1 : prevFlashcardShown
      })
    }

    const incrementIndex = () => {
        setFlashcardShown(prevFlashcardShown => {
            return prevFlashcardShown < flashcardSet.length-1 ? prevFlashcardShown + 1 : prevFlashcardShown
          })
        }

        // getting the flashcards from the server
    useEffect(() =>{
        axios.get('/get/terms').then(
            res => {
                console.log(res.data)  
                // convert dict key pairs into an array of [[key, pair], [key, pair], [key, pair]]... etc and map over them
                setFlashcardSet(Object.entries(res.data).map(([term, definition]) => {
                    return <Flashcard term={term} definition={definition} flashcardShown={flashcardShown} />
                }))
            }
        )
    }, [])

    // for debugging
    useEffect(() => {
        console.log(flashcardSet)
    }, [flashcardSet])

    // force a re render
    if(loading){
        setLoading(false)
    }

  return !loading ? (
    <div>
        {flashcardSet[flashcardShown]} 
        <button onClick={decrementIndex}>Previous</button>
        <button onClick={incrementIndex}>Next</button>
        <p>{`${flashcardShown+1}/${flashcardSet.length}`}</p>
    </div>
  ) : <p>Loading...</p>
}

export default FlashcardApp