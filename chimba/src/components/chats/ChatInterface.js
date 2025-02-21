import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './chats.css'
import { io } from "socket.io-client"
import { useAuth } from '../authorisation/AuthProvider'

const url = "http://localhost:5000"

const socket = io(url)

const ChatInterface = () => {

    const { user } = useAuth()
    const bothIDs = useParams()
    const userID = bothIDs.id1
    const connectedUserID = bothIDs.id2
    const chatUrl = window.location.href
    const [messages, setMessages] = useState([])
    const message = useRef()

    useEffect(() => {
        socket.emit("join", {user_id: user.id, chat_url: chatUrl})

        socket.on("message", (data) => {
            setMessages(prevMessages => [...prevMessages, data])
        })

        return () => {
            socket.emit("leave", {user_id: user.id, chat_url: chatUrl})
            socket.off("message")
        }
    }, [chatUrl])

    const sendMessage = () => {
        if(message.current.value){
            const msg_content = message.current.value
            socket.emit("message", {chat_url: chatUrl, sender: user.id, message: msg_content})
        }
    }

    


    return (
        <div className='chat-int'>
            ChatInterface
            {userID}
            {connectedUserID}
            
            <div className='message-container'>
                {messages.map((msg, i) => (
                    <div key={i}>{msg.sender}: {msg.message}</div>
                ))}
            </div>

            <div className='message-input'>

                <input type='text' placeholder='Enter message here' ref={message} />
                <button onClick={sendMessage}>Send</button>

            </div>
        </div>
    )
}

export default ChatInterface