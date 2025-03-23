import React, { useRef } from "react";
import Modal from "react-modal";
import { AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { MdImage } from "react-icons/md";

const CreatePost = ({ popUpOn, closePopUp, createPost }) => {

    const title = useRef()

    const description = useRef()

    const image_url = useRef()

    return (
        <Modal
            isOpen={popUpOn}
            onRequestClose={closePopUp}
            className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto mt-24 relative outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
        >
            {/* Close Button */}
            <button
                onClick={closePopUp}
                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-black"
            >
                <AiOutlineClose size={20} />
            </button>

            {/* User Name */}
            <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <AiOutlineUser className="text-white text-xl" />
                </div>
                <span className="font-medium text-lg">ExampleName</span>
            </div>

            {/* Title Input */}
            <input
                placeholder="Write your title here..."
                className="w-full border border-gray-300 rounded-md p-2 mb-4 outline-none focus:outline-none"
                ref={title}
            />

            {/* Caption */}
            <textarea
                placeholder="Write your caption here..."
                className="w-full border border-gray-300 rounded-md p-2 mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                ref={description}
            />

            {/* Attach Image */}
            <div className="flex items-center justify-between mb-4">
                <label className="flex items-center cursor-pointer text-orange-500">
                <MdImage className="mr-2 text-xl" />
                Attach image (png, jpg)
                <input type="file" className="hidden" ref={image_url} />
                </label>
                {/* Post Button */}
                <button 
                    onClick={() => createPost(title.current.value, description.current.value, image_url.current.value)}
                    className="btn btn-hover font-carlito text-stroke-3 text-xl text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors">
                    Post
                </button>
            </div>


        </Modal>
  );
};

export default CreatePost;
