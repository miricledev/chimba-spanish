import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './chats.css'
import { io } from "socket.io-client"
import { useAuth } from '../authorisation/AuthProvider'
import Message from './Message'

const url = "http://localhost:5000"

const socket = io(url)

const ChatInterface = () => {

    const { user } = useAuth()
    const bothIDs = useParams()
    const user1 = bothIDs.id1
    const user2 = bothIDs.id2
    const chatUrl = window.location.href
    const [messages, setMessages] = useState([])
    const message = useRef()

    const messagesEndRef = useRef()

    // Get the other users ID by comparing signed in user id with the params
    const receiverID = user.id==user1 ? user2 : user1

    const roomID = `${user1}/${user2}`

    // Set message to seen if on chat
    useEffect(() => {

        socket.emit('messagesSeen', {user_id: user.id})
        messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" })

    }, [chatUrl, messages])


    // Mount and unmount join / message sockets
    useEffect(() => {
        socket.emit("join", {user_id: user.id, chat_url: chatUrl, room_id: roomID})

        socket.on("message", (data) => {
            setMessages(prevMessages => [...prevMessages, data])
        })

        socket.on('loadChats', (data) => {
            console.log(data)
            console.log(data[0].sender_id)
            setMessages(prevMessages => [...prevMessages, ...data])
        })

        return () => {
            socket.emit("leave", {user_id: user.id, chat_url: chatUrl, room_id: roomID})
            socket.off("message")
            socket.off('loadChats')
        }
    }, [chatUrl])

    const sendMessage = () => {
        if(message.current.value){
            const msgContent = message.current.value
            socket.emit("message", {
                chat_url: chatUrl, 
                sender_id: user.id, 
                message_content: msgContent, 
                receiver_id: receiverID,
                room_id: roomID
            })
            message.current.value =''
        }
    }

    


    return (
        <div className='chat-int'>
            ChatInterface
            {user1}
            {user2}
            
            <div className='message-container'>
                {messages.reverse().map((msg, i) => {
                    return(
                        <Message key={i} sender={msg.sender_id} date={msg.date}  time={msg.time} >{msg.message_contents}</Message>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className='message-input'>

                <input type='text' placeholder='Enter message here' ref={message} />
                <button onClick={sendMessage}>Send</button>

            </div>
        </div>
    )
}

export default ChatInterface