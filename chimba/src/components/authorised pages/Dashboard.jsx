import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../authorisation/AuthProvider';
import { Link } from 'react-router-dom';
import CreatePost from './CreatePost';
import SearchBar from './SearchBar';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import axios from 'axios';
import Post from './Post';


const Dashboard = () => {
    const { user } = useAuth();

    const [posts, setPosts] = useState([])

    const [popUpOn, setPopUpOn] = useState(false)

    const openPopUp = () => {
        setPopUpOn(true)
    }

    const closePopUp = () => {
        setPopUpOn(false)
    }

    const createPost = (title, description, image=null) => {
        return addNewPost(user.id, title, description, image)
    }

    const addNewPost = async (author_id, title, description, image_url = null) => {
        try {
          const response = await axios.post('/api/create/post', {
            author_id,
            title,
            description,
            image_url
          });
      
          if (response.data.reply === "Post created successfully!") {
            console.log("Post added!");
      
            // Immediately update client-side state
            const newPost = {
              post_id: Date.now(), // Temporary unique ID for frontend
              author_id,
              title,
              description,
              image_url,
              like_count: 0,
              comment_count: 0,
              date_posted: new Date().toISOString()
            };
            setPosts((prevPosts) => [newPost, ...prevPosts]); // Prepend new post
      
            return true;
          } else {
            console.error("Failed to add post:", response.data.reply);
            return false;
          }
        } catch (error) {
          console.error("Error adding post:", error);
          return false;
        }
      };
      

    useEffect(() => {
        axios.get('/api/get/posts')
          .then((response) => {
            setPosts(response.data.posts);
          })
          .catch((error) => {
            console.error("Error fetching posts:", error);
          });
      }, []); // Empty dependency array = runs only on first load

    return (
      <div className="flex flex-col items-center justify-start w-300">
        <CreatePost popUpOn={popUpOn} closePopUp={closePopUp} createPost={createPost} />
        <div className='flex flex-row items-center justify-center gap-5 w-full'>
            <SearchBar placeholder='Search for posts...' />
            <button 
                className='btn btn-hover flex flex-row items-center gap-2 font-carlito text-xl p-2 rounded-lg text-stroke-3' 
                onClick={openPopUp}>
                New post <MdOutlineAddCircleOutline />
            </button>
        </div>
        <div className='flex flex-col items-center gap-5 p-10 w-full'>

            {posts && posts.map((post) => (
                <Post
                    key={post.post_id}
                    username={`User${post.author_id}`} // Replace with actual username if available
                    xp={`${post.like_count * 100}XP`} // Example XP logic
                    title={post.title}
                    description={post.description}
                    hashtags={['ChimbaSpanish', 'StreetSlang']} // Static or dynamic hashtags
                    likes={post.like_count}
                    comments={post.comment_count}
                />
            ))}
        </div>
      </div>
  );
  
};

export default Dashboard;
