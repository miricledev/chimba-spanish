import React from 'react';
import { useAuth } from '../authorisation/AuthProvider';

const Message = ({ children, sender, date, time, id }) => {
    const { user } = useAuth();
    const isUser = sender === user.id;

    const baseStyles = 'max-w-[300px] min-w-[100px] p-3 rounded-2xl break-words';
    const userStyles = 'bg-(--primary) text-black self-end';
    const recipientStyles = 'bg-gray-300 text-black self-start';

    

    return (
        <div className={`flex p-1 ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
            <div id={id} className={`${baseStyles} ${isUser ? userStyles : recipientStyles}`}>
                <p>{children}</p>
                <div className="text-xs text-gray-600 mt-1 text-right">{time}</div>
            </div>
        </div>
    );
};

export default Message;
