import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import Message from './Message'
import './Messages.css'


const AIChatInterface = () => {

  const [messages, setMessages] = useState([])
  const userMessage = useRef()
  const [typing, setTyping] = useState(false)

  const sendMessage = () => {
    if(userMessage.current.value && !typing){
      setTyping(true)
      setMessages(prevMessages => [...prevMessages, <Message user='user'>{userMessage.current.value}</Message>])
      axios.post('/api/ollama', {
        message: userMessage.current.value
      }).then(
        res => {
          userMessage.current.value = ''
          setTyping(false)
          setMessages(prevMessages => [...prevMessages, <Message user='ai'>{res.data.reply}</Message>])
        }
      ).catch(
        error => alert(error)
      )
      
    }

  }

  const handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      event.preventDefault();
      sendMessage();
    }
  }

  useEffect(() => {
    window.addEventListener('keypress', (event) => handleKeyPress(event))

    return () => window.removeEventListener('keypress', (event) => handleKeyPress(event))
  }, [])

  const resetChat = () => {
    axios.post('/api/resetai', {
      'message': 'reset' 
    })
    setMessages([])
  }

  return (
    <div className="ai-chat-container">
        {/* Move Reset button here to prevent flexbox from pushing it down */}
        

        {messages && (
            <div className="messages-container">
                {messages}
                {typing && <p className="typing-indicator">Pablo typing...</p>}
            </div>
        )}
        
        <h3>Write message here</h3>
        <textarea ref={userMessage} className="textarea"></textarea>
        <button onClick={sendMessage} className="send-button">Send message</button>
        <button onClick={resetChat} className="reset-button">Reset</button>
    </div>
);

}

export default AIChatInterface