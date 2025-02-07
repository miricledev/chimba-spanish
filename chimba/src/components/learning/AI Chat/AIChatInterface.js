import React, {useState, useRef} from 'react'
import axios from 'axios'
import Message from './Message'
import './Messages.css'


const AIChatInterface = () => {

  const [messages, setMessages] = useState([])
  const userMessage = useRef()
  const [typing, setTyping] = useState(false)

  const sendMessage = () => {
    if(userMessage.current.value){
      setTyping(true)
      setMessages(prevMessages => [...prevMessages, <Message user='user'>{userMessage.current.value}</Message>])
      axios.post('/api/ollama', {
        message: userMessage.current.value
      }).then(
        res => {
          setTyping(false)
          userMessage.value = ''
          setMessages(prevMessages => [...prevMessages, <Message user='ai'>{res.data.reply}</Message>])
        }
      ).catch(
        error => alert(error)
      )
    }

  }

  const resetChat = () => {
    axios.post('/api/resetai', {
      'message': 'reset' 
    })
    setMessages([])
  }

  return (
    <div className="ai-chat-container">
      <button onClick={resetChat}>Reset</button>
      {messages &&(<div className="messages-container">
        {messages}
        {typing && <p>Pablo typing...</p>}
      </div>)}
      <h3>Write message here</h3>
      <textarea ref={userMessage} className="textarea"></textarea>
      <button onClick={sendMessage} className="send-button" >Send message</button>

    </div>
  )
}

export default AIChatInterface