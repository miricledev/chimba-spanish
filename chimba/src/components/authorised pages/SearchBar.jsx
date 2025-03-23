import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ placeholder }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full max-w-md">
      
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        className="bg-transparent outline-none w-full"
      />
      <AiOutlineSearch className="text-gray-500 mr-2 text-xl" />
    </div>
  );
};

export default SearchBar;
