import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from "socket.io-client"
import { useAuth } from '../authorisation/AuthProvider'
import Message from './Message'
import { IoSend } from "react-icons/io5";

const url = "http://localhost:5000"

const socket = io(url)

const ChatInterface = ({setInbox, setSelectedInbox}) => {

    const { user } = useAuth()
    const bothIDs = useParams()
    console.log(`URL~: ${bothIDs}`)
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
            if(data.added_status === true){
                setInbox(prevInbox => [...prevInbox])
            }
        })

        socket.on('loadChats', (data) => {
            console.log(data)
            console.log(data[0].sender_id)
            setMessages([...data])
        })

        setSelectedInbox(roomID)


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

    const handleKeyDown = (e) => {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendMessage()
        }
    };

    


    return user1 && user2 ? (
        <div className=' w-250 flex flex-col items-center justify-center border-3 border-gray-600 rounded-xl'>
            <div className='p-5 bg-gray-200 w-full rounded-xl'>
                <h2 className='text-2xl font-medium font-carlito'>Speaking with: {receiverID}</h2>
            </div>
            
            <div className='w-full h-130 overflow-y-scroll  flex flex-col gap-4 overflow-x-hidden p-10'>
                {messages.reverse().map((msg, i) => {
                    return(
                        <Message key={i} sender={msg.sender_id} date={msg.date}  time={msg.time} >{msg.message_contents}</Message>
                    )
                })}
            <div ref={messagesEndRef} />
            </div>

            <div className='message-input p-6 w-full flex flex-row justify-center align-center bg-gray-200 rounded-xl gap-5'>

                <textarea 
                className="w-full p-3 border rounded-lg resize-none bg-white" 
                rows="4" 
                placeholder="Type your message..." 
                onKeyDown={handleKeyDown}
                ref={message}>
                </textarea>

                <button onClick={sendMessage}><IoSend className='text-3xl btn-hover overflow-y-scroll' /></button>

            </div>
        </div>
    ) : 
    <div className='flex justify-center items-center h-full w-full'>

        <h2 className='text-6xl font-carlito'>Please click on a chat</h2>
    </div>
}

export default ChatInterface