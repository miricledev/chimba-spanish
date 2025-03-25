import React from 'react';
import { AiOutlineLike, AiOutlineComment, AiOutlineMore } from 'react-icons/ai';
import { FaTrophy } from 'react-icons/fa';

const Post = ({ 
  username = "ExampleName", 
  xp = "8966XP", 
  title = "I DID IT!", 
  description, 
  hashtags = [], 
  imageUrl, 
  likes = 29, 
  comments = 3 
}) => {
  return (
    <div className="border-2 flex flex-col gap-1 rounded-lg p-4 w-full max-w-xl mx-auto bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">👤</span>
          </div>
          <div>
            <div className="font-medium">{username}</div>
            <div className="text-xs text-gray-500">{xp}</div>
          </div>
        </div>
        <AiOutlineMore className="text-xl text-gray-500 cursor-pointer" />
      </div>

      {/* Title */}
      <div className="font-bold mb-2 text-lg">
        🚀🔥 {title} 🔥🚀
      </div>

      {/* Description */}
      <p className="mb-3 text-sm">
        {description}
      </p>

      {/* Hashtags */}
      <div className="mb-4 text-blue-500 text-xs flex flex-wrap gap-1">
        {hashtags.map((tag, idx) => (
          <span key={idx}>#{tag}</span>
        ))}
      </div>

      {/* Badge / Image Section */}
      <div className="flex bg-gray-100 rounded-lg justify-between overflow-hidden mb-4">
        <div className="flex items-center justify-center p-4">
          <FaTrophy className="text-yellow-500 text-5xl mr-3" />
          <div>
            <div className="text-xl">Completed by:</div>
            <div className="font-bold text-2xl">{username}</div>
          </div>
        </div>
        <div className="bg-(--primary) text-white font-carlito flex items-center justify-center p-4 text-center w-1/2 text-3xl text-stroke-3 font-bold">
          Section 5: <br /> Street Slang
        </div>
      </div>

      <hr className='border-gray-400' />
      <br />

      {/* Footer */}
      <div className="flex justify-center gap-10 items-center text-sm">
        <div className="flex items-center text-blue-600">
          <AiOutlineLike className="mr-1 btn-hover" />
          {likes}
        </div>
        <div className="flex items-center hover:underline text-(--primary)">
          <AiOutlineComment className="mr-1 btn-hover " />
          {comments} comments
        </div>
      </div>
    </div>
  );
};

export default Post;
