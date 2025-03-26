import React from 'react';

const DialectCard = ({ country, image, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col cursor-pointer items-center border rounded-lg p-3 hover:shadow-md hover:bg-gray-50 transition"
    >
      <img
        src={image || "/placeholder.png"}
        alt={country}
        className="w-25 h-15 object-cover mb-2 rounded"
      />
      <span className="font-medium text-lg">{country}</span>
    </button>
  );
};

export default DialectCard;
