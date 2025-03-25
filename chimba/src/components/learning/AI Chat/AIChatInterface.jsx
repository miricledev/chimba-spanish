import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import Message from './Message';

const AIChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const userMessage = useRef();
  const messagesEndRef = useRef();

  const sendMessage = () => {
    if (userMessage.current.value && !typing) {
      const userMsgContent = userMessage.current.value;
      setMessages(prev => [
        ...prev,
        { sender: 'user', content: userMsgContent, time: new Date().toLocaleTimeString() }
      ]);
      setTyping(true);

      axios.post('/api/ollama', { message: userMsgContent }).then(res => {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', content: res.data.reply, time: new Date().toLocaleTimeString() }
        ]);
        setTyping(false);
        userMessage.current.value = '';
      }).catch(error => alert(error));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      resetChat();
    } 
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const resetChat = () => {
    axios.post('/api/resetai', { message: 'reset' });
    setMessages([]);
  };

  return (
    <div className='w-350 flex items-center justify-center h-full'>

      <div className='w-250 flex flex-col items-center justify-center border-3 border-gray-600 rounded-xl'>
        <div className='p-5 bg-gray-200 w-full rounded-xl flex justify-between items-center'>
          <h2 className='text-2xl font-medium font-carlito'>Speaking with: AI Assistant</h2>
          <button onClick={resetChat} className="bg-(--primary) text-white text-stroke-3 font-carlito px-4 py-1 rounded-lg text-2xl btn-hover">Reset</button>
        </div>

        <div className='w-full h-130 overflow-y-scroll flex flex-col gap-4 overflow-x-hidden p-10'>
          {messages.map((msg, i) => (
            <Message key={i} sender={msg.sender} time={msg.time}>
              {msg.content}
            </Message>
          ))}
          {typing && <p className='text-gray-500 italic'>AI Assistant is typing...</p>}
          <div ref={messagesEndRef} />
        </div>

        <div className='message-input p-6 w-full flex flex-row justify-center align-center bg-gray-200 rounded-xl gap-5'>
          <textarea
            className="w-full p-3 border rounded-lg resize-none bg-white"
            rows="4"
            placeholder="Type your message..."
            ref={userMessage}
          />
          <button onClick={sendMessage}><IoSend className='text-3xl btn-hover' /></button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
