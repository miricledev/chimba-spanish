import React from 'react';
import DialectCard from './DialectCard';
import { countryInfo } from '../HomeComponents/storage/country';
import { useAuth } from '../authorisation/AuthProvider';
import axios from 'axios';

const DialectSelector = () => {

    const { user } = useAuth() 

    const ci = [...countryInfo]
        
    const handleSelect = async (dialect) => {
        console.log("Selected:", dialect.country);
      
        try {
          const response = await axios.post('/api/set/user-course', {
            user_id: user.id,   // assuming user object has this
            course_id: dialect.id    // assuming dialect.id is your course_id
          });
      
          console.log("Enrolled successfully:", response.data);
          // Optionally navigate or update UI
        } catch (error) {
          console.error("Error enrolling in course:", error);
        }
    };

    return (
        <div className="p-6 rounded-lg bg-white shadow-md w-250 h-full mx-auto">
        <h2 className="text-xl font-semibold mb-4">Select a dialect to learn:</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {ci.map((d) => (
            <DialectCard
                key={d.id}
                country={d.country}
                image={d.image}
                onClick={() => handleSelect(d)}
            />
            ))}
        </div>
        </div>
    );
};

export default DialectSelector;
