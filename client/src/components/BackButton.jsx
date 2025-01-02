import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <button
      onClick={handleBack}
      className="px-4 py-2 bg-grey-700-500 text-white rounded-lg hover:bg-blue-600"
    >
      Back
    </button>
  );
};

export default BackButton;
