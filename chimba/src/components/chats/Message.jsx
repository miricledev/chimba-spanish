import React from 'react'
import { useAuth } from '../authorisation/AuthProvider';

const Message = ({ children, sender, date, time, key }) => {
    const { user } = useAuth()
    const isUser = (sender === user.id); 

    return (
        <div id={key} className={`message-wrapper ${isUser ? "message-user" : "message-other"}`}>
            <div className="message-bubble">
                <p className="message-text">{children}</p>
                <div className="message-meta">
                    <span className="message-time">{time}</span>
                </div>
            </div>
        </div>
    );
    };

export default Message;

