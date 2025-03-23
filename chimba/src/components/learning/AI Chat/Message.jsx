import React from 'react';

const Message = ({ children, sender, key }) => {

  const baseStyles = 'max-w-[300px] min-w-[100px] p-3 rounded-2xl break-words';
  const userStyles = 'bg-(--primary) text-black self-end';
  const recipientStyles = 'bg-gray-300 text-black self-start';

  const isUser = sender !== 'ai';

  return (
    <div key={key} className={`flex p-1 ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`${baseStyles} ${isUser ? userStyles : recipientStyles}`}>
        <p>{children}</p>
      </div>
    </div>
  );
};

export default Message;
